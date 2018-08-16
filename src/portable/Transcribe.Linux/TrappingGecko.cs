using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
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
		private static readonly string DataFolder = Program.DataFolder();
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
					case "ReportPosition":
						ReportPosition(e);
						break;
					case "WriteTranscription":
						WriteTranscription(e);
						break;
				}
			}
		}

		private void ReportPosition(GeckoObserveHttpModifyRequestEventArgs e)
		{
			var parsedQuery = HttpUtility.ParseQueryString(e.Uri.Query);
			var task = ToXmlTaskId(parsedQuery["task"]);
			var position = parsedQuery["position"];
			Debug.Print($@"Reported task={task} at position={position}");
			var tasksDoc = LoadXmlData("tasks");
			var taskNode = tasksDoc.SelectSingleNode($@"//*[@id='{task}']");
			NewAttr(taskNode, "position", position);
			using (var xw = XmlWriter.Create(XmlFullName("tasks"), new XmlWriterSettings { Indent = true }))
			{
				tasksDoc.Save(xw);
			}
		}

		private static readonly Regex TaskIdPattern = new Regex(@"(.*)v[0-9]{2}\.(mp3|wav)$", RegexOptions.Compiled);
		private static string ToXmlTaskId(string taskId)
		{
			var match = TaskIdPattern.Match(taskId);
			return match.Success? match.Groups[1].Value: taskId;
		}

		private void WriteTranscription(GeckoObserveHttpModifyRequestEventArgs e)
		{
			var parsedQuery = HttpUtility.ParseQueryString(e.Uri.Query);
			var taskid = parsedQuery["task"];
			var length = parsedQuery["length"];
			var lang = parsedQuery["lang"];
			var dir = parsedQuery["dir"];
			var transcription = GetRequestElement(e.RequestBody, "text");
			var xml = Program.XmlTemplate("transcription.eaf");
			UpdateXml(xml, "@DATE", DateTime.UtcNow.ToLocalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffzzz"));
			UpdateXml(xml, "*[local-name()='ANNOTATION_VALUE']", transcription);
			UpdateXml(xml, "@DEFAULT_LOCALE",lang);
			UpdateXml(xml, "@LANGUAGE_CODE", lang);
			var miliseconds = float.Parse(length) * 1000.0;
			var duration = miliseconds.ToString("F0");
			UpdateXml(xml,"*[@TIME_SLOT_ID='ts2']/@TIME_VALUE", duration);

			var folder = Path.Combine(DataFolder, Path.GetDirectoryName(Path.Combine(taskid.Split('-'))));
			var name = taskid;
			var ext = Path.GetExtension(name);
			UpdateXml(xml, "@MEDIA_FILE", name);
			UpdateXml(xml, "@MEDIA_URL", name);
			UpdateXml(xml, "@MIME_TYPE", ext == ".mp3"? "audio/x-mp3" : "audio/x-wav");
			var outName = Path.Combine(folder, Path.GetFileNameWithoutExtension(name) + ".eaf");
			using (var xw = XmlWriter.Create(outName, new XmlWriterSettings {Indent = true}))
			{
				xml.Save(xw);
			}
		}

		private void UpdateXml(XmlNode xml, string path, string val)
		{
			var node = xml.SelectSingleNode($@"//{path}");
			if (node != null)
			{
				node.InnerText = val;
			}
			else
			{
				Debug.Print("Missing xml path: "+ path);
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
			var setting = parsedQuery["setting"];
			var value = parsedQuery["value"];
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
			AddKeyVal("hotkey", "play-pause", playpause, userNode, usersDoc);
			AddKeyVal("hotkey", "back", back, userNode, usersDoc);
			AddKeyVal("hotkey", "forward", forward, userNode, usersDoc);
			AddKeyVal("hotkey", "slower", slower, userNode, usersDoc);
			AddKeyVal("hotkey", "faster", faster, userNode, usersDoc);
			AddKeyVal("setting", setting, value, userNode, usersDoc);
			using (var xw = XmlWriter.Create(XmlFullName("users"), new XmlWriterSettings { Indent = true }))
			{
				usersDoc.Save(xw);
			}

		}

		private void UpdateAvatar(GeckoObserveHttpModifyRequestEventArgs e)
		{
			var parsedQuery = HttpUtility.ParseQueryString(e.Uri.Query);
			var user = parsedQuery["user"];
			var avatarBase64 = GetRequestElement(e.RequestBody, "preview");
			Debug.Print($"{user}:{avatarBase64}");
			Image newAvatarImage = LoadImage(avatarBase64);
			var imageFileName = user + Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + ".png";
			var sourceFolder = Program.DataFolder();
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

		private static string GetRequestElement(byte[] data, string tag)
		{
			var text = string.Empty;
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

		private static void AddKeyVal(string tag, string keyid, string val, XmlNode userNode, XmlDocument usersDoc)
		{
			if (val == null)
				return;
			if (!(userNode.SelectSingleNode($"{tag}[@id='{keyid}']") is XmlElement node))
			{
				node = usersDoc.CreateElement(tag);
				var preceding = tag == "hotkey"
					? new List<string> {"hotkey", "project", "role"}
					: new List<string> {"setting", "progress", "speed", "timer", "uilang", "hotkey", "project", "role"};
				userNode.InsertAfter(node, FindPreceding(userNode, preceding));
				NewAttr(node, "id", keyid);
			}

			node.InnerText = val;
		}

		private static XmlElement FindPreceding(XmlNode userNode, List<string> list)
		{
			var nodes = userNode.SelectNodes(list[0]);
			Debug.Assert(nodes != null, nameof(nodes) + " != null");
			if (nodes.Count > 0)
				return nodes[nodes.Count - 1] as XmlElement;
			if (list.Count > 1)
				return FindPreceding(userNode, list.GetRange(1, list.Count - 1));
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
			var task = ToXmlTaskId(parsedQuery["task"]);
			var user = parsedQuery["user"];
			var tasksDoc = LoadXmlData("tasks");
			var taskNode = tasksDoc.SelectSingleNode($@"//task[@id=""{task}""]");
			if (taskNode == null)
				return;
			switch (action)
			{
				case "Assigned":
					if (AssignTask(e, taskNode, user))
						return;
					break;
				case "Unassigned":
					if (UnassignTask(e, taskNode, user))
						return;
					break;
				case "TranscribeStart": break;
				case "TranscribeEnd":
					if (UnassignTask(e, taskNode, user))
						return;
					if (CompleteTranscription(e, taskNode))
						return;
					break;
				case "ReviewStart": break;
				case "ReviewEnd":
					if (CompleteReview(e, taskNode))
						return;
					break;
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

		private static bool AssignTask(GeckoObserveHttpModifyRequestEventArgs e, XmlNode taskNode, string user)
		{
			var assignedTo = taskNode.SelectSingleNode("@assignedto");
			if (!string.IsNullOrEmpty(assignedTo?.InnerText))
			{
				e.Cancel = true;
				return true;
			}

			NewAttr(taskNode, "assignedto", user);
			return false;
		}

		private static bool CompleteTranscription(GeckoObserveHttpModifyRequestEventArgs e, XmlNode taskNode)
		{
			var state = taskNode.SelectSingleNode("@state") as XmlAttribute;
			if (state?.InnerText != "Transcribe")
			{
				e.Cancel = true;
				return true;
			}

			NewAttr(taskNode, "state", "Review");
			return false;
		}

		private static bool CompleteReview(GeckoObserveHttpModifyRequestEventArgs e, XmlNode taskNode)
		{
			var state = taskNode.SelectSingleNode("@state") as XmlAttribute;
			if (state?.InnerText != "Review")
			{
				e.Cancel = true;
				return true;
			}

			NewAttr(taskNode, "state", "Upload");
			return false;
		}

		private static bool UnassignTask(GeckoObserveHttpModifyRequestEventArgs e, XmlNode taskNode, string user)
		{
			var assignedTo2 = taskNode.SelectSingleNode("@assignedto") as XmlAttribute;
			if (string.IsNullOrEmpty(assignedTo2?.InnerText) || assignedTo2.InnerText != user)
			{
				e.Cancel = true;
				return true;
			}

			Debug.Assert(taskNode.Attributes != null, "taskNode.Attributes != null");
			taskNode.Attributes.Remove(assignedTo2);
			return false;
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
				AsArray(node.SelectNodes(".//setting"));
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
				var sourceFolder = Program.DataFolder();
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
				foreach (XmlNode taskNode in taskNodes)
				{
					var assignedTo = taskNode.SelectSingleNode("@assignedto")?.InnerText;
					if (assignedTo != user)
						continue;
					var id = taskNode.SelectSingleNode("@id");
					var audioName = CopyAudioFile(id?.InnerText);
					if (id != null && !string.IsNullOrEmpty(audioName))
					{
						id.InnerText = audioName;
						InitializeTranscription(id.InnerText, taskNode, apiFolder);
					}
				}
				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Substring(11);
				taskList.Add(jsonContent.Substring(0, jsonContent.Length - 1));
			}

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetTasks")))
			{
				sw.Write($"[{string.Join(",", taskList)}]");
			}
		}

		private static void InitializeTranscription(string taskId, XmlNode taskNode, string apiFolder)
		{
			var idName = Path.GetFileNameWithoutExtension(taskId);
			var eafName = idName + ".eaf";
			var folder = Path.Combine(DataFolder, Path.GetDirectoryName(Path.Combine(idName.Split('-'))));
			var eafFullName = Path.Combine(folder, eafName);
			if (!File.Exists(eafFullName))
				return;

			var eafDoc = new XmlDocument();
			using (var xr = XmlReader.Create(eafFullName))
			{
				eafDoc.Load(xr);
			}

			var transcriptionDoc = new XmlDocument();
			transcriptionDoc.LoadXml("<root/>");
			var position = taskNode.SelectSingleNode("@position")?.InnerText;
			if (position != null)
				NewAttr(transcriptionDoc.DocumentElement, "position", position);
			var transcription = eafDoc.SelectSingleNode("//*[local-name()='ANNOTATION_VALUE']")?.InnerText;
			if (!string.IsNullOrEmpty(transcription))
			{
				var transcriptionNode = transcriptionDoc.CreateElement("transcription");
				transcriptionNode.InnerText = transcription;
				Debug.Assert(transcriptionDoc.DocumentElement != null, "transcriptionDoc.DocumentElement != null");
				transcriptionDoc.DocumentElement.AppendChild(transcriptionNode);
			}

			var transcriptionJson =
				JsonConvert.SerializeXmlNode(transcriptionDoc.DocumentElement).Replace("\"@", "\"").Substring(8);
			using (var sw = new StreamWriter(Path.Combine(apiFolder, "audio", idName + ".transcription")))
			{
				sw.Write(transcriptionJson.Substring(0, transcriptionJson.Length - 1));
			}
		}

		private static void AsArray(XmlNodeList nodes)
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

		private string CopyAudioFile(string taskid)
		{
			var name = string.Empty;
			var folder = Path.Combine(DataFolder, Path.GetDirectoryName(Path.Combine(taskid.Split('-'))));
			var apiFolder = ApiFolder();
			var audioFolder = Path.Combine(apiFolder, "audio");
			if (!Directory.Exists(audioFolder))
				Directory.CreateDirectory(audioFolder);
			var dirInfo = new DirectoryInfo(folder);
			foreach (var ext in ".mp3;.wav".Split(';'))
			{
				var files = dirInfo.GetFiles(taskid + "*" + ext);
				foreach (var fileInfo in files)
				{
					if (string.Compare(fileInfo.Name, name, StringComparison.Ordinal) > 1)
						name = fileInfo.Name;
				}
				var target = Path.Combine(audioFolder, name);
				if (File.Exists(target))
					break;
				if (!string.IsNullOrEmpty(name))
				{
					File.Copy(Path.Combine(folder, name), target);
				}
			}

			return name;
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
