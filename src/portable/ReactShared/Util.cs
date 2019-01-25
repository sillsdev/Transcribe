using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml;
using Newtonsoft.Json;

namespace ReactShared
{
	public class Util
	{
		public static string Folder { get; set; }
		public static string DataFolder =
			Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
		public static readonly List<string> SupportFile = new List<string>();
		public static readonly Regex TaskIdPattern = new Regex(@"(.*)v[0-9]{2}\.(mp3|wav)$", RegexOptions.Compiled);
		private static readonly Regex FileTaskIdPattern = new Regex(@"(.*)(v[0-9]{2})(\.mp3|\.wav)?$", RegexOptions.Compiled);

		public static string FileFolder(string taskId)
		{
			var match = FileTaskIdPattern.Match(taskId);
			if (match.Success)
				taskId = match.Groups[1].Value;
			return Path.Combine(DataFolder, Path.GetDirectoryName(Path.Combine(taskId.Split('-'))));
		}

		public static string ApiFolder()
		{
			var apiFolder = Path.Combine(Folder, "api");
			if (!Directory.Exists(apiFolder))
				Directory.CreateDirectory(apiFolder);
			return apiFolder;
		}

		public static string ToXmlTaskId(string taskId)
		{
			var match = TaskIdPattern.Match(taskId);
			return match.Success ? match.Groups[1].Value : taskId;
		}

		public static XmlDocument LoadXmlData(string name)
		{
			var fullName = XmlFullName(name);
			if (!File.Exists(fullName))
				GetResource.DefaultData(name);
			var xDoc = new XmlDocument();
			using (var xr = XmlReader.Create(fullName))
			{
				xDoc.Load(xr);
			}
			return xDoc;
		}

		public static string XmlFullName(string name)
		{
			return Path.Combine(DataFolder, name + ".xml");
		}

		public static void NewAttr(XmlNode node, string name, string val)
		{
			if (val == null || val == "undefined")
				return;
			Debug.Assert(node.OwnerDocument != null, "node.OwnerDocument != null");
			var idAttr = node.OwnerDocument.CreateAttribute(name);
			idAttr.InnerText = val;
			node.Attributes.Append(idAttr);
		}

		public static void UpdateAttr(XmlElement node, string name, string val, bool allowEmpty = false)
		{
			if (!allowEmpty && string.IsNullOrEmpty(val) || val == "undefined")
				return;
			if (node.HasAttribute(name))
				node.Attributes[name].InnerText = val;
			else
			{
				NewAttr(node, name, val);
			}
		}

		public static XmlElement NewChild(XmlElement node, string name, string val = null)
		{
			if (node == null || node.OwnerDocument == null)
				return null;
			var elem = node.OwnerDocument.CreateElement(name);
			node.AppendChild(elem);
			if (val != null)
				elem.InnerText = val;
			return elem;
		}

		public static void AsArray(XmlNodeList nodes)
		{
			if (nodes.Count != 1)
				return;
			AsArray(new List<XmlNode> { nodes[0] });
		}

		public static void AsArray(List<XmlNode> nodes)
		{
			if (nodes.Count != 1)
				return;
			var node = nodes[0];
			Debug.Assert(node.OwnerDocument != null, "node.OwnerDocument != null");
			var jsonConvertAttr =
				node.OwnerDocument.CreateAttribute("json", "Array", "http://james.newtonking.com/projects/json");
			jsonConvertAttr.InnerText = "true";
			Debug.Assert(node.Attributes != null, "node.Attributes != null");
			node.Attributes.Append(jsonConvertAttr);
		}

		public static XmlNode UserNode(string user)
		{
			var usersDoc = !string.IsNullOrEmpty(user) ? LoadXmlData("users") : null;
			var userNode = usersDoc?.SelectSingleNode($"//*[local-name() = 'user' and username/@id='{user}']");
			return userNode;
		}

		public static XmlElement GetUserProjectNode(XmlNode userNode, string project, XmlDocument usersDoc, string user)
		{
			var userProjectNode = userNode.SelectSingleNode($"project[@id = '{project}']") as XmlElement;
			if (userProjectNode != null)
				return userProjectNode;

			userProjectNode = usersDoc.CreateElement("project");
			NewAttr(userProjectNode, "id", project);
			var roleNodes = userNode.SelectNodes("role");
			Debug.Assert(roleNodes?.Count > 0, $"user {user} missing role");
			userNode.InsertAfter(userProjectNode, roleNodes[roleNodes.Count - 1]);

			return userProjectNode;
		}

		public static XmlElement FindPreceding(XmlNode userNode, List<string> list)
		{
			var nodes = userNode.SelectNodes(list[0]);
			Debug.Assert(nodes != null, nameof(nodes) + " != null");
			if (nodes.Count > 0)
				return nodes[nodes.Count - 1] as XmlElement;
			if (list.Count > 1)
				return FindPreceding(userNode, list.GetRange(1, list.Count - 1));
			return null;
		}

		public static string GetRequestElement(byte[] data, string tag)
		{
			var text = string.Empty;
			if (data == null)
				return text;
			using (var ms = new MemoryStream(data))
			{
				using (var str = new StreamReader(ms))
				{
					try
					{
						var xml = JsonConvert.DeserializeXmlNode(@"{""state"":" + str.ReadToEnd() + "}");
						text = xml.SelectSingleNode($@"//{tag}").InnerText;
					}
					catch (Exception err)
					{
						Debug.Print(err.Message);
					}
				}
			}

			return text;
		}

		public static void DeleteFolder(string fullPath)
		{
			var folder = Path.GetDirectoryName(fullPath);
			try
			{
				Directory.Delete(folder);
				DeleteFolder(folder);
			}
			catch
			{
				// if not empty, ignore delete directory
			}
		}

		public static void SaveByteData(string audioData, string fullPath)
		{
			var audioParts = audioData.Split(',').ToList();
			if (audioParts.Count <= 1)
				return;
			var dummyData = audioParts[1].Trim().Replace(" ", "+");
			if (dummyData.Length % 4 > 0)
				dummyData = dummyData.PadRight(dummyData.Length + 4 - dummyData.Length % 4, '=');
			var bytes = Convert.FromBase64String(dummyData);

			using (var ms = new MemoryStream(bytes))
			{
				var buffer = new byte[1000];
				using (var os = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
				{
					int count;
					do
					{
						count = ms.Read(buffer, 0, 1000);
						os.Write(buffer, 0, count);
					} while (count > 0);
				}
			}
		}

		public static bool Testing;
		public static string TestingOutputDirectory;
	}
}
