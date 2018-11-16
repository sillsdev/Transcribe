using System.Diagnostics;
using System.IO;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class UpdateProjectAvatar
	{
		public delegate void SaveImage(string data, string file);

		public UpdateProjectAvatar(string query, byte[] requestBody, SaveImage saveImage)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var project = parsedQuery["project"];
			var avatarBase64 = Util.GetRequestElement(requestBody, "img");
			Debug.Print($"{project}:{avatarBase64}");
			var imageFileName = project + Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + ".png";
			var sourceFolder = Path.Combine(Util.DataFolder, "images");
			var sourceInfo = new DirectoryInfo(sourceFolder);
			sourceInfo.Create();
			saveImage(avatarBase64, Path.Combine(sourceFolder, imageFileName));
			var tasksDoc = Util.LoadXmlData("tasks");
			var projectNode = tasksDoc.SelectSingleNode($"//tasks[project/@id = '{project}']");
			if (projectNode != null)
			{
				var taskNode = projectNode.SelectSingleNode("project") as XmlElement;
				Debug.Assert(taskNode != null, nameof(taskNode) + " != null");
				Util.UpdateAttr(taskNode, "uri", @"images/" + imageFileName);
			}
			using (var xw = XmlWriter.Create(Util.XmlFullName("tasks"), new XmlWriterSettings { Indent = true }))
			{
				tasksDoc.Save(xw);
			}
		}
	}
}
