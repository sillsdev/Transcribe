using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Xml;
using Newtonsoft.Json;

namespace ReactShared
{
	public class GetUsers
	{
		public GetUsers()
		{
			var apiFolder = Util.ApiFolder();
			var usersDoc = Util.LoadXmlData("users");

			CopyAvatars(usersDoc, apiFolder);

			var jsonList = UsersJsonList(usersDoc);

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetUsers")))
			{
				sw.Write($"[{string.Join(",", jsonList)}]");
			}
		}

		private static void CopyAvatars(XmlNode usersDoc, string apiFolder)
		{
			var avatarNodes = usersDoc.SelectNodes("//*[local-name()='avatarUri']");
			Debug.Assert(avatarNodes != null, nameof(avatarNodes) + " != null");
			foreach (XmlNode avatarNode in avatarNodes)
			{
				var sourceFolder = Util.DataFolder;
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
				Util.AsArray(node.SelectNodes(".//role"));
				Util.AsArray(node.SelectNodes(".//project"));
				Util.AsArray(node.SelectNodes(".//hotkey"));
				Util.AsArray(node.SelectNodes(".//setting"));
				Util.NewAttr(node, "id", item.ToString());
				item += 1;
				Util.NewAttr(node, "displayName", keyValuePair.Key);
				if (userNodes.Count == 1)
				{
					var ci = CultureInfo.InstalledUICulture;
					Util.NewAttr(node, "oslang", ci.TwoLetterISOLanguageName);
				}
				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Replace("#text", "text").Substring(8);
				jsonList.Add(jsonContent.Substring(0, jsonContent.Length - 1));
			}

			return jsonList;
		}

	}
}
