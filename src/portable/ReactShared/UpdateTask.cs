using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class UpdateTask
	{
		public UpdateTask(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var task = parsedQuery["task"];
			var taskId = string.Empty;
			if (task.EndsWith(".mp3"))
			{
				taskId = task.Substring(0, task.IndexOf("v0", StringComparison.InvariantCulture));
			}
			else
			{
				taskId = task;
			}

			var project = parsedQuery["project"];
			var audioFile = parsedQuery["audioFile"];
			var reference = parsedQuery["reference"];
			var heading = parsedQuery["heading"];
			var assignedTo = parsedQuery["assignedTo"];
			var timeDuration = parsedQuery["timeDuration"];

			//Debug.Print($"{task}:{project}:{audioFile}:{reference}:{heading}:{assignedTo}:{timeDuration}");
			var tasksDoc = Util.LoadXmlData("tasks");
			var taskNode = tasksDoc.SelectSingleNode($"//task[@id = '{taskId}']");
			if (taskNode == null)
				return;
			var taskNameNode = taskNode.SelectSingleNode("name") as XmlElement;
			Debug.Assert(taskNameNode != null, nameof(taskNameNode) + " != null");
			taskNameNode.InnerText = heading;
			taskNode.Attributes["assignedto"].Value = assignedTo;
			
			using (var xw = XmlWriter.Create(Util.XmlFullName("tasks"), new XmlWriterSettings {Indent = true}))
			{
				tasksDoc.Save(xw);
			}
		}
	}
}