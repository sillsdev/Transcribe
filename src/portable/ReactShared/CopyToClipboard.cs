using System.IO;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class CopyToClipboard
	{
		public delegate void ToClipboard(string data);

		public CopyToClipboard(string query, ToClipboard toClipboard)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var taskid = parsedQuery["task"];
			var folder = Util.FileFolder(taskid);
			var name = taskid;
			var eafName = Path.Combine(folder, Path.GetFileNameWithoutExtension(name) + ".eaf");
			var eafDoc = new XmlDocument();
			using (var xr = XmlReader.Create(eafName))
				eafDoc.Load(xr);
			var transcription = eafDoc.SelectSingleNode("//*[local-name()='ANNOTATION_VALUE']")?.InnerText;
			toClipboard(transcription);
		}
	}
}
