using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using System.Xml;
using Gecko;
using Newtonsoft.Json;
using Directory = System.IO.Directory;

namespace Transcribe.Windows
{
	public class TrappingGecko : GeckoWebBrowser//, IPlatformSpecifics
	{
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
				if (e.Uri.Segments[1] == "api/")
				{
					switch (e.Uri.Segments[2])
					{
						case "GetUsers":
							GetUsers();
							break;
					}
				}
			}
		}

		private void GetUsers()
		{
			var apiFolder = Path.Combine(Folder, "api");
			if (!Directory.Exists(apiFolder))
				Directory.CreateDirectory(apiFolder);
			var usersFullName = Path.Combine(Application.CommonAppDataPath, "users.xml");
			if (!File.Exists(usersFullName))
				Program.DefaultData("users");
			var usersDoc = new XmlDocument();
			using (var xr = XmlReader.Create(usersFullName))
			{
				usersDoc.Load(xr);
			}

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

			var jsonBuilder = new List<string>();
			var item = 0;
			foreach (KeyValuePair<string, XmlNode> keyValuePair in sortedUsers)
			{
				var node = keyValuePair.Value;
				Debug.Assert(node.OwnerDocument != null, "node.OwnerDocument != null");
				var attr = node.OwnerDocument.CreateAttribute("id");
				attr.InnerText = item.ToString();
				Debug.Assert(node.Attributes != null, "node.Attributes != null");
				node.Attributes.Append(attr);
				var displayNameElem = node.OwnerDocument.CreateElement("displayName");
				displayNameElem.InnerText = keyValuePair.Key;
				node.AppendChild(displayNameElem);
				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Substring(8);
				jsonBuilder.Add(jsonContent.Substring(0, jsonContent.Length - 1));
			}

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetUsers")))
			{
				sw.Write($"[{string.Join(",", jsonBuilder)}]");
			}
		}

	}
}
