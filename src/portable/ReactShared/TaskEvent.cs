using System;
using System.Diagnostics;
using System.IO;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class TaskEvent
	{
		public delegate bool Upload(string task);

		public bool Exec(string query, Upload ToParatext = null)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var action = parsedQuery["action"];
			var task = Util.ToXmlTaskId(parsedQuery["task"]);
			var user = parsedQuery["user"];
			var tasksDoc = Util.LoadXmlData("tasks");
			var taskNode = tasksDoc.SelectSingleNode($@"//task[@id=""{task}""]");
			if (taskNode == null)
				return true;
			switch (action)
			{
				case "Assigned":
					if (AssignTask(taskNode, user))
						return true;
					break;
				case "Unassigned":
					if (UnassignTask(taskNode, user))
						return true;
					break;
				case "TranscribeStart": break;
				case "TranscribeEnd":
					if (UnassignTask(taskNode, user))
						return true;
					if (CompleteTranscription(taskNode))
						return true;
					break;
				case "ReviewStart": break;
				case "ReviewEnd":
					if (CompleteReview(taskNode))
						return true;
					break;
				case "HoldStart": break;
				case "HoldEnd": break;
				case "Upload":
					if (ToParatext != null && ToParatext(parsedQuery["task"]))
						return true;
					break;
				case "Complete": break;
			}
			var historyNodes = taskNode.SelectNodes(".//history");
			Debug.Assert(historyNodes != null, nameof(historyNodes) + " != null");

			var historyNode = tasksDoc.CreateElement("history");
			Util.NewAttr(historyNode, "id", historyNodes.Count.ToString());
			Util.NewAttr(historyNode, "datetime", DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ"));
			Util.NewAttr(historyNode, "action", action);
			Util.NewAttr(historyNode, "userid", user);
			taskNode.AppendChild(historyNode);
			using (var xw = XmlWriter.Create(Util.XmlFullName("tasks"), new XmlWriterSettings { Indent = true }))
			{
				tasksDoc.Save(xw);
			}

			return false;
		}

		private bool AssignTask(XmlNode taskNode, string user)
		{
			var assignedTo = taskNode.SelectSingleNode("@assignedto");
			if (!string.IsNullOrEmpty(assignedTo?.InnerText))
				return true;

			Util.NewAttr(taskNode, "assignedto", user);
			return false;
		}

		private bool CompleteTranscription(XmlNode taskNode)
		{
			var state = taskNode.SelectSingleNode("@state") as XmlAttribute;
			if (state?.InnerText != "Transcribe")
				return true;

			Util.NewAttr(taskNode, "state", "Review");
			return false;
		}

		private bool CompleteReview(XmlNode taskNode)
		{
			var state = taskNode.SelectSingleNode("@state") as XmlAttribute;
			if (state?.InnerText != "Review")
				return true;

			Util.NewAttr(taskNode, "state", "Upload");
			return false;
		}

		private bool UnassignTask(XmlNode taskNode, string user)
		{
			var assignedTo2 = taskNode.SelectSingleNode("@assignedto") as XmlAttribute;
			if (string.IsNullOrEmpty(assignedTo2?.InnerText) || assignedTo2.InnerText != user)
				return true;

			Debug.Assert(taskNode.Attributes != null, "taskNode.Attributes != null");
			taskNode.Attributes.Remove(assignedTo2);
			return false;
		}

	}
}
