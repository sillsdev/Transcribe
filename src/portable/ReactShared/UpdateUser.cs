using System.Collections.Generic;
using System.Diagnostics;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class UpdateUser
	{
		public UpdateUser(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
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
			var usersDoc = Util.LoadXmlData("users");
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

	}
}
