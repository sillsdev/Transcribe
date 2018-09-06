using System.Diagnostics;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class ReportPosition
	{
		public ReportPosition(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var task = Util.ToXmlTaskId(parsedQuery["task"]);
			var position = parsedQuery["position"];
			Debug.Print($@"Reported task={task} at position={position}");
			var tasksDoc = Util.LoadXmlData("tasks");
			var taskNode = tasksDoc.SelectSingleNode($@"//*[@id='{task}']");
			Util.NewAttr(taskNode, "position", position);
			using (var xw = XmlWriter.Create(Util.XmlFullName("tasks"), new XmlWriterSettings { Indent = true }))
			{
				tasksDoc.Save(xw);
			}
		}

	}
}
