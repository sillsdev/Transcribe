using System.Diagnostics;
using System.IO;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class UpdateAvatar
	{
		public delegate void SaveImage(string data, string file);

		public UpdateAvatar(string query, byte[] requestBody, SaveImage saveImage)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var user = parsedQuery["user"];
			var avatarBase64 = Util.GetRequestElement(requestBody, "img");
			var fromPath = Util.GetRequestElement(requestBody, "fromPath");
			Debug.Print($"{user}:{avatarBase64}");
			var usersDoc = Util.LoadXmlData("users");
			var userNode = usersDoc.SelectSingleNode($"//user[username/@id = '{user}']");
			if (userNode == null || fromPath.ToLower() == "popupuser")
			{
				var imagePathToTemp = GenerateImageFile(user, Util.ApiFolder(), false);
				saveImage(avatarBase64, imagePathToTemp);
				var imagePathToLocal = GenerateImageFile(user, Util.DataFolder, false);
				saveImage(avatarBase64, imagePathToLocal);
			}
			else
			{
				var imagePathToLocal = GenerateImageFile(user, Util.DataFolder, true);
				saveImage(avatarBase64, imagePathToLocal);
				var usernameNode = userNode.SelectSingleNode("username") as XmlElement;
				Debug.Assert(usernameNode != null, nameof(usernameNode) + " != null");
				AddAvatarUri("images/" + Path.GetFileName(imagePathToLocal), usernameNode, usersDoc);
				using (var xw = XmlWriter.Create(Util.XmlFullName("users"), new XmlWriterSettings { Indent = true }))
				{
					usersDoc.Save(xw);
				}

			}
		}

		private string GenerateImageFile( string user, string copyFolder, bool isUnique)
		{
			var imageFileName = user + Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + ".png";
			if (!isUnique)
			{
				imageFileName = user + ".png";
			}
			var sourceFolder = Path.Combine(copyFolder, "images");
			var sourceInfo = new DirectoryInfo(sourceFolder);
			sourceInfo.Create();
			return Path.Combine(sourceFolder, imageFileName);
		}

		private static void AddAvatarUri(string avatarUri, XmlElement usernameNode, XmlDocument usersDoc)
		{
			if (avatarUri == null)
				return;
			if (!(usernameNode.SelectSingleNode("avatarUri") is XmlNode avatarNode))
				avatarNode = Util.NewChild(usernameNode, "avatarUri");
			avatarNode.InnerText = avatarUri;
		}

	}
}
