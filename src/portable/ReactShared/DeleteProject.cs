using System.Diagnostics;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class DeleteProject
	{
		public DeleteProject(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var id = parsedQuery["project"];
			var message =
				$"DeleteProject id={id}";
			Debug.Print(message);
			var tasksDoc = Util.LoadXmlData("tasks");
			var taskNode = tasksDoc.SelectSingleNode($"//project[@id = '{id}']") ??
			               Util.NewChild(tasksDoc.DocumentElement,"project");
			if (taskNode == null)
				return;
			taskNode.ParentNode?.RemoveChild(taskNode);
			using (var xw = XmlWriter.Create(Util.XmlFullName("tasks"), new XmlWriterSettings { Indent = true }))
			{
				tasksDoc.Save(xw);
			}

		}
	}
}
