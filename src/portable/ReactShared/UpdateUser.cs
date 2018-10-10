using System.Collections.Generic;
using System.Diagnostics;
using System.Web;
using System.Xml;
using Newtonsoft.Json;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using Newtonsoft.Json.Linq;

namespace ReactShared
{
	public class UpdateUser
	{
		public UpdateUser(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var user = parsedQuery["user"];
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
			Debug.Print($"{user}:{project}:{name}:{uilang}:{font}:{fontsize}:{playpause}:{back}:{forward}:{slower}:{faster}");
			var usersDoc = Util.LoadXmlData("users");
			var userNode = usersDoc.SelectSingleNode($"//user[username/@id = '{user}']");
			if (userNode == null)
			{
				userNode = usersDoc.CreateElement("user");
				var userName = usersDoc.CreateElement("username");
				userNode.AppendChild(userName);
				var userId = !string.IsNullOrEmpty(user)? user:
					(!string.IsNullOrEmpty(name)? name.Replace(" ","").ToLower():
					$@"u{usersDoc.SelectNodes("//user").Count + 1}");
				Util.NewAttr(userName, "id", userId);
				var userPassword = usersDoc.CreateElement("password");
				userName.AppendChild(userPassword);
				var userAvatarUri = usersDoc.CreateElement("avatarUri");
				userName.AppendChild(userAvatarUri);
				XmlNode roleNode = null;
				if (string.IsNullOrEmpty(role))
				{
					role = "Transcriber";
				}
				roleNode = usersDoc.CreateElement("role");
				roleNode.InnerText = role;
				userNode.AppendChild(roleNode);

				if (!string.IsNullOrEmpty(project))
				{
					AddFontInfo("fontfamily", "SIL Charis", userNode, project, usersDoc, user);
					AddFontInfo("fontsize", "large", userNode, project, usersDoc, user);
				}

				var defaultUserHotKeys = new GetDefaultUserHotKeys();
				var apiFolder = Util.ApiFolder();
				var fileText = File.ReadAllText(Path.Combine(apiFolder, "GetDefaultUserHotKeys"));
				var oJson = JsonConvert.DeserializeObject(fileText);
				for (int i = 0; i < ((Newtonsoft.Json.Linq.JContainer) oJson).Count; i++)
				{
					var theHotKey = ((Newtonsoft.Json.Linq.JContainer) oJson)[i].ToString().Replace("\r","").Replace("\n","");
					theHotKey = theHotKey.Replace("{", "").Replace("}", "");
					string[] theHotKeyArray = theHotKey.Split(',');
					string[] theHotKeyArrayId = theHotKeyArray[0].Split(':');
					var hotKeyName = theHotKeyArrayId[1].Replace("\"", "");
					string[] theHotKeyArrayValue = theHotKeyArray[1].Split(':');
					var hotKeyValue = theHotKeyArrayValue[1].Replace("\"", "");
					var hotkey = usersDoc.CreateElement("hotkey");
					Util.NewAttr(hotkey, "id", hotKeyName);
					hotkey.InnerText = hotKeyValue;
					userNode.AppendChild(hotkey);
				}

				AddUilang("en-US", userNode, usersDoc);
				AddTimer("countdown", userNode, usersDoc);
				AddSpeed("75", userNode, usersDoc);
				AddProgress("bar", userNode, usersDoc);

				usersDoc.DocumentElement.AppendChild(userNode);
			}
			var usernameNode = userNode.SelectSingleNode("username") as XmlElement;
			Debug.Assert(usernameNode != null, nameof(usernameNode) + " != null");
			AddUserName(name, usernameNode, usersDoc);
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
			string newRole = roleTranscriber;
			if (role.ToLower() == "admin")
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
			{
				node = usersDoc.CreateElement(nodeName);
				userProjectNode.AppendChild(node);
			}

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
