using System.Text.RegularExpressions;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class DeleteTask
	{
		public static readonly Regex ReferencePattern = new Regex(@"^([A-Za-z1-3]{3}) ([0-9]{1,3}):([0-9]{1,3})-([0-9]{1,3})$", RegexOptions.Compiled);

		public DeleteTask(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var task = parsedQuery["task"];
			var taskMatch = Util.TaskIdPattern.Match(task);
			var taskId = taskMatch.Success ? taskMatch.Groups[1].Value : task;


			//Debug.Print($"{task}:{project}:{audioFile}:{reference}:{heading}:{assignedTo}:{timeDuration}");
			var tasksDoc = Util.LoadXmlData("tasks");

			var taskNode = tasksDoc.SelectSingleNode($"//task[@id = '{taskId}']") as XmlElement;
			if (taskNode == null)
				return;

			taskNode.ParentNode.RemoveChild(taskNode);

			using (var xw = XmlWriter.Create(Util.XmlFullName("tasks"), new XmlWriterSettings {Indent = true}))
			{
				tasksDoc.Save(xw);
			}
		}

	}
}