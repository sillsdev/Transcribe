using System.Collections.Generic;
using System.Diagnostics;
using System.Web;
using System.Xml;
using Newtonsoft.Json;
using System.IO;

namespace ReactShared
{
	public class UpdateUser
	{
		public delegate void SaveImage(string data, string file);

		public UpdateUser(string query, byte[] requestBody = null, SaveImage saveImage = null)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var user = parsedQuery["user"];
			var password = parsedQuery["password"];
			var role = parsedQuery["role"];
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
			var avatarBase64 = Util.GetRequestElement(requestBody, "img");
			Debug.Print($"{user}:{project}:{name}:{uilang}:{font}:{fontsize}:{playpause}:{back}:{forward}:{slower}:{faster}");
			var usersDoc = Util.LoadXmlData("users");
			var admin = usersDoc.SelectSingleNode("//user[./role='administrator']");
			var userNode = usersDoc.SelectSingleNode($"//user[username/@id = '{user}']") as XmlElement;
			var userId = !string.IsNullOrEmpty(user) ? user : name.Replace(" ", "").ToLower();
			if (userNode == null)
			{
				userNode = Util.NewChild(usersDoc.DocumentElement, "user");
				var userName = Util.NewChild(userNode, "username");
				var others = usersDoc.SelectNodes($"//user[starts-with(username,'{userId}')]");
				Debug.Assert(others != null, nameof(others) + " != null");
				if (others.Count > 0)
				{
					userId += $"{others.Count + 1}";
				}
				Util.NewAttr(userName, "id", userId);
				Util.NewChild(userName, "password", password);
				AddNewAvatar(saveImage, avatarBase64, userId, userName);
				if (string.IsNullOrEmpty(avatarBase64))
					Util.NewChild(userName, "avatarUri");
				else
					avatarBase64 = "";
				if (string.IsNullOrEmpty(role))
				{
					role = "Transcriber";
				}
				Util.NewChild(userNode, "role", role);

				if (!string.IsNullOrEmpty(project))
				{
					AddFontInfo("fontfamily", "SIL Charis", userNode, project, usersDoc, user);
					AddFontInfo("fontsize", "large", userNode, project, usersDoc, user);
				}

				using (new GetDefaultUserHotKeys())
				{
					// This method creates the GetDefaultsUserHotKeys JSON response in the api folder
				}
				var apiFolder = Util.ApiFolder();
				var fileText = File.ReadAllText(Path.Combine(apiFolder, "GetDefaultUserHotKeys"));
				var jsonFileText =
					$@"{{""hotkey"":{fileText.Replace(@"""id""", @"""@id""").Replace(@"""text""", @"""#text""")}}}";
				var hotkeyNodes = JsonConvert.DeserializeXmlNode(jsonFileText, "user").SelectNodes("//hotkey");
				Debug.Assert(hotkeyNodes != null, nameof(hotkeyNodes) + " != null");
				foreach (XmlNode hotkeyNode in hotkeyNodes)
				{
					var newHotKey = Util.NewChild(userNode, "hotkey", hotkeyNode.InnerText.ToUpper());
					Debug.Assert(hotkeyNode.Attributes != null, "hotkeyNode.Attributes != null");
					Util.NewAttr(newHotKey, "id", hotkeyNode.Attributes["id"].InnerText);
				}

				var defLang = admin?.SelectSingleNode("./uilang");
				if (defLang != null)
					AddUilang(defLang.InnerText, userNode, usersDoc);
				AddTimer("countup", userNode, usersDoc);
				AddSpeed("100", userNode, usersDoc);
				AddProgress("bar", userNode, usersDoc);
			}
			var usernameNode = userNode.SelectSingleNode("username") as XmlElement;
			Debug.Assert(usernameNode != null, nameof(usernameNode) + " != null");
			AddUserName(name, usernameNode, usersDoc);
			AddPassword(password, usernameNode, usersDoc);
			AddNewAvatar(saveImage, avatarBase64, userId, usernameNode);
			var userRoleNode = userNode.SelectNodes("role") as XmlNodeList;
			Debug.Assert(userRoleNode != null, nameof(userRoleNode) + " != null");
			AddUserRole(role, userRoleNode, usernameNode, usersDoc);
			AddUilang(uilang, userNode, usersDoc);
			AddFontInfo("fontfamily", font, userNode, project, usersDoc, user);
			AddFontInfo("fontsize", fontsize, userNode, project, usersDoc, user);
			AddKeyVal("hotkey", "play-pause", playpause, userNode, usersDoc);
			AddKeyVal("hotkey", "back", back, userNode, usersDoc);
			AddKeyVal("hotkey", "forward", forward, userNode, usersDoc);
			AddKeyVal("hotkey", "slower", slower, userNode, usersDoc);
			AddKeyVal("hotkey", "faster", faster, userNode, usersDoc);
			AddKeyVal("setting", setting, value, userNode, usersDoc);
			using (var xw = XmlWriter.Create(Util.XmlFullName("users"), new XmlWriterSettings { Indent = true }))
			{
				usersDoc.Save(xw);
			}
		}

		private static void AddNewAvatar(SaveImage saveImage, string avatarBase64, string userId, XmlElement userName)
		{
			if (!string.IsNullOrEmpty(avatarBase64) && avatarBase64.Contains(","))	// file names have no commas but base64 data has comma separated fields.
			{
				var sourceFolder = Path.Combine(Util.DataFolder, "images");
				var sourceInfo = new DirectoryInfo(sourceFolder);
				sourceInfo.Create();
				var info = new DirectoryInfo(sourceFolder).GetFiles(userId + "*.png");
				var imageFileName = $"{userId}{info.Length + 1}.png";
				saveImage(avatarBase64, Path.Combine(sourceFolder, imageFileName));
				AddAvatarUri("images/" + imageFileName, userName);
			}
		}

		private static void AddAvatarUri(string avatarUri, XmlElement usernameNode)
		{
			if (avatarUri == null)
				return;
			if (!(usernameNode.SelectSingleNode("avatarUri") is XmlNode avatarNode))
				avatarNode = Util.NewChild(usernameNode, "avatarUri");
			avatarNode.InnerText = avatarUri;
		}

		private static void AddUserName(string name, XmlElement usernameNode, XmlDocument usersDoc)
		{
			if (name == null)
				return;
			if (!(usernameNode.SelectSingleNode("fullname") is XmlElement fullNameNode))
				fullNameNode = Util.NewChild(usernameNode, "fullname");

			fullNameNode.InnerText = name;

			if (usernameNode.Attributes["id"].InnerText.Length == 0)
			{
				usernameNode.Attributes["id"].InnerText = name.Replace(" ", "").ToLower();
			}
		}

		private static void AddPassword(string password, XmlElement usernameNode, XmlDocument usersDoc)
		{
			if (password == null)
				return;
			if (!(usernameNode.SelectSingleNode("password") is XmlElement passwordNode))
				passwordNode = Util.NewChild(usernameNode, "password");

			passwordNode.InnerText = password;
		}


		private static void AddUserRole(string role, XmlNodeList userRoleNodeList, XmlElement usernameNode, XmlDocument usersDoc)
		{
			if (role == null)
				return;

			//Remove the old roles
			for (int i = userRoleNodeList.Count - 1; i >= 0; i--)
			{
				userRoleNodeList[i].ParentNode.RemoveChild(userRoleNodeList[i]);
			}

			string roleAdmin = "administrator";
			string roleReviewer = "reviewer";
			string roleTranscriber = "transcriber";
			List<string> roleArray = new List<string>();
			if (role.ToLower() == "admin" || role.ToLower() == "administrator")
			{
				roleArray.Add(roleAdmin);
				roleArray.Add(roleReviewer);
				roleArray.Add(roleTranscriber);
			}
			else if (role.ToLower() == roleReviewer)
			{
				roleArray.Add(roleReviewer);
			}
			else if (role.ToLower() == roleTranscriber)
			{
				roleArray.Add(roleTranscriber);
			}
			else if (role.ToLower() == roleReviewer + " + " + roleTranscriber)
			{
				roleArray.Add(roleReviewer);
				roleArray.Add(roleTranscriber);
			}

			foreach (string userRole in roleArray)
			{
				XmlElement roleNode = usersDoc.CreateElement("role");
				roleNode.InnerText = userRole;
				usernameNode.ParentNode.InsertAfter(roleNode, usernameNode);
			}			
		}

		private static void AddUilang(string uilang, XmlNode userNode, XmlDocument usersDoc)
		{
			if (uilang == null)
				return;
			if (!(userNode.SelectSingleNode("uilang") is XmlElement uilangNode))
			{
				uilangNode = usersDoc.CreateElement("uilang");
				userNode.InsertAfter(uilangNode, Util.FindPreceding(userNode, new List<string> { "hotkey", "project", "role" }));
			}

			uilangNode.InnerText = uilang;
		}

		private static void AddFontInfo(string nodeName, string data, XmlNode userNode, string project, XmlDocument usersDoc, string user)
		{
			if (data == null)
				return;
			var userProjectNode = Util.GetUserProjectNode(userNode, project, usersDoc, user);
			if (!(userProjectNode.SelectSingleNode(nodeName) is XmlElement node))
				node = Util.NewChild(userProjectNode, nodeName);

			node.InnerText = data;
		}

		private static void AddKeyVal(string tag, string keyid, string val, XmlNode userNode, XmlDocument usersDoc)
		{
			if (val == null)
				return;
			if (!(userNode.SelectSingleNode($"{tag}[@id='{keyid}']") is XmlElement node))
			{
				node = usersDoc.CreateElement(tag);
				var preceding = tag == "hotkey"
					? new List<string> { "hotkey", "project", "role" }
					: new List<string> { "setting", "progress", "speed", "timer", "uilang", "hotkey", "project", "role" };
				userNode.InsertAfter(node, Util.FindPreceding(userNode, preceding));
				Util.NewAttr(node, "id", keyid);
			}

			node.InnerText = val;
		}

		private static void AddTimer(string timer, XmlNode userNode, XmlDocument usersDoc)
		{
			if (timer == null)
				return;
			if (!(userNode.SelectSingleNode("timer") is XmlElement timerNode))
			{
				timerNode = usersDoc.CreateElement("timer");
				userNode.InsertAfter(timerNode, Util.FindPreceding(userNode, new List<string> { "uilang", "hotkey", "project", "role" }));
			}

			timerNode.InnerText = timer;
		}

		private static void AddSpeed(string speed, XmlNode userNode, XmlDocument usersDoc)
		{
			if (speed == null)
				return;
			if (!(userNode.SelectSingleNode("speed") is XmlElement speedNode))
			{
				speedNode = usersDoc.CreateElement("speed");
				userNode.InsertAfter(speedNode, Util.FindPreceding(userNode, new List<string> { "timer", "uilang", "hotkey", "project", "role" }));
			}

			speedNode.InnerText = speed;
		}

		private static void AddProgress(string progress, XmlNode userNode, XmlDocument usersDoc)
		{
			if (progress == null)
				return;
			if (!(userNode.SelectSingleNode("progress") is XmlElement progressNode))
			{
				progressNode = usersDoc.CreateElement("progress");
				userNode.InsertAfter(progressNode, Util.FindPreceding(userNode, new List<string> { "speed", "timer", "uilang", "hotkey", "project", "role" }));
			}

			progressNode.InnerText = progress;
		}
	}
}
