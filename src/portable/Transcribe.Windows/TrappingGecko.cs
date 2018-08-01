﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Windows.Forms;
using System.Xml;
using Gecko;
using Newtonsoft.Json;
using Directory = System.IO.Directory;

namespace Transcribe.Windows
{
	public class TrappingGecko : GeckoWebBrowser//, IPlatformSpecifics
	{
		private static readonly string DataFolder = Path.GetDirectoryName(Application.CommonAppDataPath);
		public string Folder { get; set; }

		protected override void OnObserveHttpModifyRequest(GeckoObserveHttpModifyRequestEventArgs e)
		{
			Debug.Print(e.Uri.AbsoluteUri);
			var method = e.Channel.RequestMethod;
			if (method == "GET")
			{
				if (e.Uri.Segments[1] != "api/")
					return;
				switch (e.Uri.Segments[2])
				{
					case "GetUsers":
						GetUsers();
						break;
					case "GetTasks":
						GetTasks(e.Uri.Query);
						break;
				}
			}
			else if (method == "PUT")
			{
				if (e.Uri.Segments[1] != "api/")
					return;
				switch (e.Uri.Segments[2])
				{
					case "TaskEvent":
						TaskEvent(e);
						break;
					case "UpdateUser":
						UpdateUser(e);
						break;
					case "UpdateAvatar":
						UpdateAvatar(e);
						break;
				}
			}
		}

		private void UpdateUser(GeckoObserveHttpModifyRequestEventArgs e)
		{
			var parsedQuery = HttpUtility.ParseQueryString(e.Uri.Query);
			var user = parsedQuery["user"];
			var project = parsedQuery["project"];
			var name = parsedQuery["name"];
			var uilang = parsedQuery["uilang"];
			var font = parsedQuery["font"];
			var fontsize = parsedQuery["fontsize"];
			var playpause = parsedQuery["playpause"];
			var back = parsedQuery["back"];
			var forward = parsedQuery["forward"];
			var slower = parsedQuery["slower"];
			var faster = parsedQuery["faster"];
			Debug.Print($"{user}:{project}:{name}:{uilang}:{font}:{fontsize}:{playpause}:{back}:{forward}:{slower}:{faster}");
			var usersDoc = LoadXmlData("users");
			var userNode = usersDoc.SelectSingleNode($"//user[username/@id = '{user}']");
			if (userNode == null)
				return;
			var usernameNode = userNode.SelectSingleNode("username") as XmlElement;
			Debug.Assert(usernameNode != null, nameof(usernameNode) + " != null");
			AddUserName(name, usernameNode, usersDoc);
			AddUilang(uilang, userNode, usersDoc);
			AddFontInfo("fontfamily", font, userNode, project, usersDoc, user);
			AddFontInfo("fontsize", fontsize, userNode, project, usersDoc, user);
			AddHotkey("play-pause", playpause, userNode, usersDoc);
			AddHotkey("back", back, userNode, usersDoc);
			AddHotkey("forward", forward, userNode, usersDoc);
			AddHotkey("slower", slower, userNode, usersDoc);
			AddHotkey("faster", faster, userNode, usersDoc);
			using (var xw = XmlWriter.Create(XmlFullName("users"), new XmlWriterSettings { Indent = true }))
			{
				usersDoc.Save(xw);
			}

		}

		private void UpdateAvatar(GeckoObserveHttpModifyRequestEventArgs e)
		{
			var parsedQuery = HttpUtility.ParseQueryString(e.Uri.Query);
			var user = parsedQuery["user"];
			var avatarBase64 = AvatarBase64(e.RequestBody);
			Debug.Print($"{user}:{avatarBase64}");
			Image newAvatarImage = LoadImage(avatarBase64);
			var imageFileName = user + Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + ".png";
			var sourceFolder = Path.GetDirectoryName(Application.CommonAppDataPath);
			if (sourceFolder != null) newAvatarImage.Save(Path.Combine(sourceFolder, "images/" + imageFileName));
			var usersDoc = LoadXmlData("users");
			var userNode = usersDoc.SelectSingleNode($"//user[username/@id = '{user}']");
			if (userNode == null)
				return;
			var usernameNode = userNode.SelectSingleNode("username") as XmlElement;
			Debug.Assert(usernameNode != null, nameof(usernameNode) + " != null");
			AddAvatarUri("images/" + imageFileName, usernameNode, usersDoc);
			using (var xw = XmlWriter.Create(XmlFullName("users"), new XmlWriterSettings { Indent = true }))
			{
				usersDoc.Save(xw);
			}
		}

		private static string AvatarBase64(byte[] data)
		{
			var avatarBase64 = string.Empty;
			using (var ms = new MemoryStream(data))
			{
				using (var str = new StreamReader(ms))
				{
					try
					{
						var xml = JsonConvert.DeserializeXmlNode(@"{""state"":" + str.ReadToEnd() + "}");
						avatarBase64 = xml.SelectSingleNode("//preview").InnerText;
					}
					catch (Exception err)
					{
						Debug.Print(err.Message);
					}
				}
			}

			return avatarBase64;
		}

		public Image LoadImage(string avatarUriString)
		{
			Image image = null;
			var imageParts = avatarUriString.Split(',').ToList<string>();
			try
			{
				string dummyData = imageParts[1].Trim().Replace(" ", "+");
				if (dummyData.Length % 4 > 0)
					dummyData = dummyData.PadRight(dummyData.Length + 4 - dummyData.Length % 4, '=');
				var bytes = Convert.FromBase64String(dummyData);

				using (MemoryStream ms = new MemoryStream(bytes))
				{
					image = Image.FromStream(ms);
				}
			}
			catch {}
			return image;
		}

		private static void AddHotkey(string keyid, string playpause, XmlNode userNode, XmlDocument usersDoc)
		{
			if (playpause != null)
			{
				if (!(userNode.SelectSingleNode($"hotkey[@id='{keyid}']") is XmlElement node))
				{
					node = usersDoc.CreateElement("hotkey");
					userNode.InsertAfter(node, FindPreceding(userNode, new List<string> {"hotkey", "project", "role"}));
					NewAttr(node, "id", keyid);
				}

				node.InnerText = playpause;
			}
		}

		private static XmlElement FindPreceding(XmlNode userNode, List<string> list)
		{
			var nodes = userNode.SelectNodes(list[0]);
			Debug.Assert(nodes != null, nameof(nodes) + " != null");
			if (nodes.Count > 0)
				return nodes[nodes.Count - 1] as XmlElement;
			if (list.Count > 1)
				return FindPreceding(userNode, list.GetRange(0, list.Count - 1));
			return null;
		}

		private static void AddFontInfo(string nodeName, string data, XmlNode userNode, string project, XmlDocument usersDoc, string user)
		{
			if (data == null)
				return;
			var userProjectNode = GetUserProjectNode(userNode, project, usersDoc, user);
			if (!(userProjectNode.SelectSingleNode(nodeName) is XmlElement node))
			{
				node = usersDoc.CreateElement(nodeName);
				userProjectNode.AppendChild(node);
			}

			node.InnerText = data;
		}

		private static XmlNode GetUserProjectNode(XmlNode userNode, string project, XmlDocument usersDoc, string user)
		{
			var userProjectNode = userNode.SelectSingleNode($"project[@id = '{project}']");
			if (userProjectNode == null)
			{
				userProjectNode = usersDoc.CreateElement("project");
				NewAttr(userProjectNode, "id", project);
				var roleNodes = userNode.SelectNodes("role");
				Debug.Assert(roleNodes?.Count > 0, $"user {user} missing role");
				userNode.InsertAfter(userProjectNode, roleNodes[roleNodes.Count - 1]);
			}

			return userProjectNode;
		}

		private static void AddUilang(string uilang, XmlNode userNode, XmlDocument usersDoc)
		{
			if (uilang == null)
				return;
			if (!(userNode.SelectSingleNode("uilang") is XmlElement uilangNode))
			{
				uilangNode = usersDoc.CreateElement("uilang");
				userNode.InsertAfter(uilangNode, FindPreceding(userNode, new List<string> { "hotkey", "project", "role" }));
			}

			uilangNode.InnerText = uilang;
		}

		private static void AddUserName(string name, XmlElement usernameNode, XmlDocument usersDoc)
		{
			if (name == null)
				return;
			if (!(usernameNode.SelectSingleNode("fullname") is XmlElement fullNameNode))
			{
				fullNameNode = usersDoc.CreateElement("fullname");
				usernameNode.AppendChild(fullNameNode);
			}

			fullNameNode.InnerText = name;
		}

		private static void AddAvatarUri(string avatarUri, XmlElement usernameNode, XmlDocument usersDoc)
		{
			if (avatarUri == null)
				return;
			if (!(usernameNode.SelectSingleNode("avatarUri") is XmlElement avatarNode))
			{
				avatarNode = usersDoc.CreateElement("avatarUri");
				usernameNode.AppendChild(avatarNode);
			}
			avatarNode.InnerText = avatarUri;
		}

		private void TaskEvent(GeckoObserveHttpModifyRequestEventArgs e)
		{
			var parsedQuery = HttpUtility.ParseQueryString(e.Uri.Query);
			var action = parsedQuery["action"];
			var task = parsedQuery["task"];
			var user = parsedQuery["user"];
			var tasksDoc = LoadXmlData("tasks");
			var taskNode = tasksDoc.SelectSingleNode($@"//task[@id=""{task}""]");
			if (taskNode == null)
				return;
			switch (action)
			{
				case "Assigned":
					var assignedTo = taskNode.SelectSingleNode("@assignedto");
					if (!string.IsNullOrEmpty(assignedTo?.InnerText))
					{
						e.Cancel = true;
						return;
					}
					NewAttr(taskNode, "assignedto", user);
					break;
				case "Unassigned":
					var assignedTo2 = taskNode.SelectSingleNode("@assignedto") as XmlAttribute;
					if (string.IsNullOrEmpty(assignedTo2?.InnerText) || assignedTo2.InnerText != user)
					{
						e.Cancel = true;
						return;
					}
					Debug.Assert(taskNode.Attributes != null, "taskNode.Attributes != null");
					taskNode.Attributes.Remove(assignedTo2);
					break;
				case "TranscribeStart": break;
				case "TranscribeEnd": break;
				case "ReviewStart": break;
				case "ReviewEnd": break;
				case "HoldStart": break;
				case "HoldEnd": break;
				case "Upload": break;
				case "Complete": break;
			}
			var historyNodes = taskNode.SelectNodes(".//history");
			Debug.Assert(historyNodes != null, nameof(historyNodes) + " != null");

			var historyNode = tasksDoc.CreateElement("history");
			NewAttr(historyNode, "id", historyNodes.Count.ToString());
			NewAttr(historyNode, "datetime", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"));
			NewAttr(historyNode,"action", action);
			NewAttr(historyNode, "userid", user);
			taskNode.AppendChild(historyNode);
			using (var xw = XmlWriter.Create(XmlFullName("tasks"), new XmlWriterSettings{Indent = true}))
			{
				tasksDoc.Save(xw);
			}
		}

		private static void NewAttr(XmlNode node, string name, string val)
		{
			Debug.Assert(node.OwnerDocument != null, "node.OwnerDocument != null");
			var idAttr = node.OwnerDocument.CreateAttribute(name);
			idAttr.InnerText = val;
			node.Attributes.Append(idAttr);
		}

		private void GetUsers()
		{
			var apiFolder = ApiFolder();
			var usersDoc = LoadXmlData("users");

			CopyAvatars(usersDoc, apiFolder);

			var jsonList = UsersJsonList(usersDoc);

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetUsers")))
			{
				sw.Write($"[{string.Join(",", jsonList)}]");
			}
		}

		private static List<string> UsersJsonList(XmlDocument usersDoc)
		{
			var sortedUsers = new SortedList<string, XmlNode>();
			var userNodes = usersDoc.SelectNodes("//*[local-name()='user']");
			Debug.Assert(userNodes != null, nameof(userNodes) + " != null");
			foreach (XmlElement userNode in userNodes)
			{
				var key = userNode.SelectSingleNode(".//*[local-name()='fullname']")?.InnerText;
				if (string.IsNullOrEmpty(key))
					key = userNode.SelectSingleNode(".//*[@id]/@id")?.InnerText;
				Debug.Assert(key != null, nameof(key) + " != null");
				sortedUsers[key] = userNode;
			}

			var jsonList = new List<string>();
			var item = 0;
			foreach (KeyValuePair<string, XmlNode> keyValuePair in sortedUsers)
			{
				var node = keyValuePair.Value;
				AsArray(node.SelectNodes(".//role"));
				AsArray(node.SelectNodes(".//project"));
				AsArray(node.SelectNodes(".//hotkey"));
				NewAttr(node, "id", item.ToString());
				item += 1;
				NewAttr(node, "displayName", keyValuePair.Key);
				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Replace("#text", "text").Substring(8);
				jsonList.Add(jsonContent.Substring(0, jsonContent.Length - 1));
			}

			return jsonList;
		}

		private static void CopyAvatars(XmlNode usersDoc, string apiFolder)
		{
			var avatarNodes = usersDoc.SelectNodes("//*[local-name()='avatarUri']");
			Debug.Assert(avatarNodes != null, nameof(avatarNodes) + " != null");
			foreach (XmlNode avatarNode in avatarNodes)
			{
				var sourceFolder = Path.GetDirectoryName(Application.CommonAppDataPath);
				var avatarRelName = avatarNode.InnerText;
				var sourceFullName = Path.Combine(sourceFolder, avatarRelName);
				if (!File.Exists(sourceFullName))
					continue;
				avatarNode.InnerText = "/api/" + avatarRelName;
				var avatarFolder = Path.GetDirectoryName(avatarRelName);
				var targetFolder = string.IsNullOrEmpty(avatarFolder) ? apiFolder : Path.Combine(apiFolder, avatarFolder);
				if (!Directory.Exists(targetFolder))
					Directory.CreateDirectory(targetFolder);
				var apiImageFullName = Path.Combine(apiFolder, avatarRelName);
				if (File.Exists(apiImageFullName)) continue;
				File.Copy(sourceFullName, apiImageFullName);
			}
		}

		private static XmlDocument LoadXmlData(string name)
		{
			var fullName = XmlFullName(name);
			if (!File.Exists(fullName))
				Program.DefaultData(name);
			var xDoc = new XmlDocument();
			using (var xr = XmlReader.Create(fullName))
			{
				xDoc.Load(xr);
			}

			return xDoc;
		}

		private static string XmlFullName(string name)
		{
			return Path.Combine(DataFolder, name + ".xml");
		}

		private string ApiFolder()
		{
			var apiFolder = Path.Combine(Folder, "api");
			if (!Directory.Exists(apiFolder))
				Directory.CreateDirectory(apiFolder);
			return apiFolder;
		}

		private void GetTasks(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var user = parsedQuery["user"];
			var userNode = UserNode(user);
			var apiFolder = ApiFolder();
			var tasksDoc = LoadXmlData("tasks");
			var projectNodes = tasksDoc.SelectNodes("//*[local-name()='project']");
			Debug.Assert(projectNodes != null, nameof(projectNodes) + " != null");
			var taskList = new List<string>();
			foreach (XmlNode node in projectNodes)
			{
				var taskNodes = node.SelectNodes(".//*[local-name() = 'task']");
				Debug.Assert(taskNodes != null, nameof(taskNodes) + " != null");
				TaskSkillFilter(taskNodes, userNode, user);
				if (taskNodes.Count == 0)
					continue;
				AsArray(taskNodes);
				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Substring(11);
				taskList.Add(jsonContent.Substring(0, jsonContent.Length - 1));
				foreach (XmlNode taskNode in taskNodes)
				{
					var assignedTo = taskNode.SelectSingleNode("@assignedto")?.InnerText;
					if (assignedTo != user)
						continue;
					var id = taskNode.SelectSingleNode("@id");
					CopyAudioFile(id?.InnerText);
				}
			}

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetTasks")))
			{
				sw.Write($"[{string.Join(",", taskList)}]");
			}
		}

		private static void AsArray(XmlNodeList nodes)
		{
			if (nodes.Count == 1)
			{
				var node = nodes[0];
				Debug.Assert(node.OwnerDocument != null, "node.OwnerDocument != null");
				var jsonConvertAttr =
					node.OwnerDocument.CreateAttribute("json", "Array", "http://james.newtonking.com/projects/json");
				jsonConvertAttr.InnerText = "true";
				Debug.Assert(node.Attributes != null, "node.Attributes != null");
				node.Attributes.Append(jsonConvertAttr);
			}
		}

		private void CopyAudioFile(string taskid)
		{
			var folder = Path.Combine(DataFolder, Path.GetDirectoryName(Path.Combine(taskid.Split('-'))));
			var apiFolder = ApiFolder();
			var audioFolder = Path.Combine(apiFolder, "audio");
			if (!Directory.Exists(audioFolder))
				Directory.CreateDirectory(audioFolder);
			var dirInfo = new DirectoryInfo(folder);
			foreach (var ext in ".mp3;.wav".Split(';'))
			{
				var target = Path.Combine(audioFolder, taskid + ext);
				if (File.Exists(target))
					continue;
				var files = dirInfo.GetFiles(taskid + "*" + ext);
				var name = string.Empty;
				foreach (var fileInfo in files)
				{
					if (string.Compare(fileInfo.Name, name, StringComparison.Ordinal) > 1)
						name = fileInfo.Name;
				}
				if (!string.IsNullOrEmpty(name))
				{
					File.Copy(Path.Combine(folder, name), target);
				}
			}

		}

		private void TaskSkillFilter(XmlNodeList taskNodes, XmlNode userNode, string userName)
		{
			var skill = userNode?.SelectSingleNode("./@skill")?.InnerText;
			switch (skill)
			{
				case "trainee":
					foreach (XmlNode node in taskNodes)
					{
						var projectType = node.SelectSingleNode("./parent::*/@type")?.InnerText;
						if (!string.IsNullOrEmpty(projectType) && projectType == "test")
							continue;
						Debug.Assert(node.ParentNode != null, "node.ParentNode != null");
						node.ParentNode.RemoveChild(node);
					}
					break;
				case "supervised":
					foreach (XmlNode node in taskNodes)
					{
						var assignedTo = node.SelectSingleNode("./@assignedto")?.InnerText;
						if (assignedTo == userName)
							continue;
						Debug.Assert(node.ParentNode != null, "node.ParentNode != null");
						node.ParentNode.RemoveChild(node);
					}
					break;
				default:
					foreach (XmlNode node in taskNodes)
					{
						var assignedTo = node.SelectSingleNode("./@assignedto")?.InnerText;
						if (string.IsNullOrEmpty(assignedTo) || assignedTo == userName)
							continue;
						Debug.Assert(node.ParentNode != null, "node.ParentNode != null");
						node.ParentNode.RemoveChild(node);
					}
					break;

			}
		}

		private static XmlNode UserNode(string user)
		{
			var usersDoc = !string.IsNullOrEmpty(user) ? LoadXmlData("users") : null;
			var userNode = usersDoc?.SelectSingleNode($"//*[local-name() = 'user' and username/@id='{user}']");
			return userNode;
		}
	}
}
