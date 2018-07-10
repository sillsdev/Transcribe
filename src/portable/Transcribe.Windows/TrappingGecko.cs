using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
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

		protected override void OnDomClick(DomMouseEventArgs e)
		{
			var elem = Document.ActiveElement;
			var uri = elem.HasAttribute("Href") ? elem.GetAttribute("Href") :
				elem.Parent.HasAttribute("Href") ? elem.Parent.GetAttribute("Href") :
				"";
			const string scheme = "hybrid:";
			if (!uri.StartsWith(scheme)) base.OnDomClick(e);
			e.Handled = true;
			var resources = uri.Substring(scheme.Length).Split('?');
			var method = resources[0];
			var parameters = resources.Length > 1? System.Web.HttpUtility.ParseQueryString(resources[1]): null;
			switch (method)
			{
				case "VowelChart": break;
				case "ConstChart": break;
				//case "DataCorpus": DisplayPages.DisplayData(); break;
				//case "Search": break;
				//case "Project": DisplayPages.DisplayOpenProject(); break;
				//case "Settings": break;
				//case "DistChart": break;
				//case "Steps": break;
				//case "Close": Program.DisplayMenu(); break;
			}
		}

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
				}
			}
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
			using (var xw = XmlWriter.Create(XmlFullName("tasks")))
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
				NewAttr(node, "id", item.ToString());
				item += 1;
				NewAttr(node, "displayName", keyValuePair.Key);
				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Substring(8);
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
				var sourceFolder = Application.CommonAppDataPath;
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
			var userNode = UserNode(query);
			var apiFolder = ApiFolder();
			var tasksDoc = LoadXmlData("tasks");
			var projectNodes = tasksDoc.SelectNodes("//*[local-name()='project']");
			Debug.Assert(projectNodes != null, nameof(projectNodes) + " != null");
			var taskList = new List<string>();
			foreach (XmlNode node in projectNodes)
			{
				var taskNodes = node.SelectNodes(".//*[local-name() = 'task']");
				Debug.Assert(taskNodes != null, nameof(taskNodes) + " != null");
				TaskSkillFilter(taskNodes, userNode);
				if (taskNodes.Count == 0)
					continue;
				if (taskNodes.Count == 1)
				{
					var taskNode = taskNodes[0];
					Debug.Assert(taskNode.OwnerDocument != null,"taskNode.OwnerDocument != null");
					var jsonConvertAttr = taskNode.OwnerDocument.CreateAttribute("json", "Array", "http://james.newtonking.com/projects/json");
					jsonConvertAttr.InnerText = "true";
					Debug.Assert(taskNode.Attributes != null, "taskNode.Attributes != null");
					taskNode.Attributes.Append(jsonConvertAttr);
				}
				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Substring(11);
				taskList.Add(jsonContent.Substring(0, jsonContent.Length - 1));
				foreach (XmlNode taskNode in taskNodes)
				{
					var assignedTo = taskNode.SelectSingleNode("@assignedto");
					if (!string.IsNullOrEmpty(assignedTo?.InnerText))
					{
						var id = taskNode.SelectSingleNode("@id");
						CopyAudioFile(id?.InnerText);
					}
				}
			}

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetTasks")))
			{
				sw.Write($"[{string.Join(",", taskList)}]");
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

		private void TaskSkillFilter(XmlNodeList taskNodes, XmlNode userNode)
		{
			var skill = userNode?.SelectSingleNode("./@skill")?.InnerText;
			var userName = userNode?.SelectSingleNode("./*[local-name() = 'username']/@id")?.InnerText;
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

		private static XmlNode UserNode(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var usersDoc = parsedQuery.Count != 0 ? LoadXmlData("users") : null;
			var userNode = usersDoc?.SelectSingleNode($"//*[local-name() = 'user' and username/@id='{parsedQuery.GetValues(0)[0]}']");
			return userNode;
		}
	}
}
