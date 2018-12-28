using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Xml;
using Newtonsoft.Json;

namespace ReactShared
{
	public class GetTasks
	{
		public GetTasks(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var user = parsedQuery["user"];
			var project = parsedQuery["project"];
			var userNode = Util.UserNode(user);
			var apiFolder = Util.ApiFolder();
			var tasksDoc = Util.LoadXmlData("tasks");
			var projectXpath = string.IsNullOrEmpty(project)?
				"//*[local-name()='project']":
				$"//*[local-name()='project' and @id='{project}']";
			var projectNodes = tasksDoc.SelectNodes(projectXpath);
			Debug.Assert(projectNodes != null, nameof(projectNodes) + " != null");
			var taskList = new List<string>();
			CopyAvatars(tasksDoc, apiFolder);
			foreach (XmlElement node in projectNodes)
			{
				var filterNodeList = new List<XmlNode>();
				var taskNodes = node.SelectNodes(".//*[local-name() = 'task']");
				var claim = node.SelectSingleNode("./@claim") as XmlAttribute;
				if (!string.IsNullOrEmpty(user))
					TaskSkillFilter(taskNodes, ref filterNodeList, userNode, user, claim);
				else
				{
					foreach (XmlNode tNode in taskNodes)
					{
						filterNodeList.Add(tNode);
					}
				}
				if (filterNodeList.Count == 0)
					{
						var emptyTaskNode = Util.NewChild(node, "task");
						Util.AsArray(new List<XmlNode> {emptyTaskNode});
					}
				Util.AsArray(filterNodeList);
				foreach (XmlNode taskNode in filterNodeList)
				{
					Util.AsArray(taskNode.SelectNodes("./history"));
					var id = taskNode.SelectSingleNode("@id");
					var audioName = CopyAudioFile(id?.InnerText);
					if (id != null && !string.IsNullOrEmpty(audioName))
					{
						id.InnerText = audioName;
						InitializeTranscription(id.InnerText, taskNode, apiFolder);
					}
				}

				var deleteNodes = new List<XmlNode>();
				foreach (XmlNode taskNode in taskNodes)
					if (!filterNodeList.Contains(taskNode))
						deleteNodes.Add(taskNode);
				foreach (var t in deleteNodes)
					node.RemoveChild(t);

				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"false\"","false").Replace("\"true\"","true").Replace("\"@", "\"").Substring(11);
				// Calling GetSortedTasksJson to Sort the tasks based on Reference
				var projectJsonString = GetSortedTasksJson(jsonContent.Substring(0, jsonContent.Length - 1));
				taskList.Add(projectJsonString);
			}
			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetTasks")))
			{
				sw.Write($"[{string.Join(",", taskList)}]".Replace("{}", ""));
			}
		}

		/// <summary>
		/// Sorting the tasks based on the reference
		/// </summary>
		/// <param name="inputJsonString"></param>
		/// <returns>json string with tasks sorted</returns>
		private static string GetSortedTasksJson(string inputJsonString)
		{
			// Deserialize jsonContent to the object of class Project
			Project theProject = JsonConvert.DeserializeObject<Project>(inputJsonString);
			if (theProject.task.Count == 1 && theProject.task[0].id == "")
			{
				// no tasks
			}
			else
			{
				foreach (TaskJson t in theProject.task)
				{
					var theIdParts = t.id.Split('-');
					// Getting the book number based on the BookName
					var theBookNumber = Convert.ToInt16(Util.BookNamesDict[theIdParts[1]]);
					// newId is assigned value - with BookNumber instead of BookName
					t.newId = theBookNumber.ToString() + theIdParts[2] + theIdParts[3].Substring(0, 3) + theIdParts[3].Substring(3, 3);
				}

				// Order by the newId field
				var sortedTasks = theProject.task.OrderBy(t => Convert.ToUInt64(t.newId)).ToList();
				// Set the project's task as the sortedTasks
				theProject.task = sortedTasks;
			}

			// Serialize the Project object into Json string and return it
			return JsonConvert.SerializeObject(theProject);
		}

		private static void CopyAvatars(XmlNode tasksDoc, string apiFolder)
		{
			var projectNodes = tasksDoc.SelectNodes("//*[local-name()='project']");
			Debug.Assert(projectNodes != null, nameof(projectNodes) + " != null");
			foreach (XmlNode avatarNode in projectNodes)
			{
				var sourceFolder = Util.DataFolder;
				var avatarRelName = avatarNode.Attributes["uri"].Value;
				var sourceFullName = Path.Combine(sourceFolder, avatarRelName);
				if (!File.Exists(sourceFullName))
					continue;
				avatarNode.Attributes["uri"].Value = "/api/" + avatarRelName;
				var avatarFolder = Path.GetDirectoryName(avatarRelName);
				var targetFolder = string.IsNullOrEmpty(avatarFolder) ? apiFolder : Path.Combine(apiFolder, avatarFolder);
				if (!Directory.Exists(targetFolder))
					Directory.CreateDirectory(targetFolder);
				var apiImageFullName = Path.Combine(apiFolder, avatarRelName);
				if (File.Exists(apiImageFullName)) continue;
				File.Copy(sourceFullName, apiImageFullName);
			}
		}

		private void TaskSkillFilter(XmlNodeList taskNodes, ref List<XmlNode> filterNodeList, XmlNode userNode, string userName, XmlAttribute claim)
		{
			var skill = userNode?.SelectSingleNode("./@skill")?.InnerText;
			if (claim != null && claim.Value == "false")
				skill = "supervised";
			switch (skill)
			{
				case "trainee":
					foreach (XmlNode node in taskNodes)
					{
						var projectType = node.SelectSingleNode("./parent::*/@type")?.InnerText;
						if (!string.IsNullOrEmpty(projectType) && projectType == "test")
						{
							if (isUserRole(userNode, node.Attributes["state"].Value))
								filterNodeList.Add(node);
						}
					}

					break;
				case "supervised":
					foreach (XmlNode node in taskNodes)
					{
						var assignedTo = node.SelectSingleNode("./@assignedto")?.InnerText;
						if (assignedTo == userName)
						{
							if (isUserRole(userNode, node.Attributes["state"].Value))
								filterNodeList.Add(node);
						}
					}

					break;
				default:
					foreach (XmlNode node in taskNodes)
					{
						var assignedTo = node.SelectSingleNode("./@assignedto")?.InnerText;
						if (string.IsNullOrEmpty(assignedTo) || assignedTo == userName)
						{
							if (isUserRole(userNode, node.Attributes["state"].Value))
								filterNodeList.Add(node);
						}
					}

					break;
			}
		}

		private bool isUserRole(XmlNode userNode, string state)
		{
			return
				(state.ToLower() == "transcribe" &&
				 userNode.SelectSingleNode("./role/text()[.='transcriber']") != null) ||
				((state.ToLower() == "transcribe" || state.ToLower() == "review") &&
				 userNode.SelectSingleNode("./role/text()[.='reviewer']") != null);
		}

		private string CopyAudioFile(string taskid)
		{
			var name = string.Empty;
			var folder = Util.FileFolder(taskid);
			var apiFolder = Util.ApiFolder();
			var audioFolder = Path.Combine(apiFolder, "audio");
			if (!Directory.Exists(audioFolder))
				Directory.CreateDirectory(audioFolder);
			var dirInfo = new DirectoryInfo(folder);
			if (!dirInfo.Exists)
				return null;
			foreach (var ext in ".mp3;.wav".Split(';'))
			{
				var files = dirInfo.GetFiles(taskid + "*" + ext);
				foreach (var fileInfo in files)
				{
					if (string.Compare(fileInfo.Name, name, StringComparison.Ordinal) > 1)
						name = fileInfo.Name;
				}
				var target = Path.Combine(audioFolder, name);
				if (File.Exists(target))
					break;
				if (!string.IsNullOrEmpty(name))
				{
					File.Copy(Path.Combine(folder, name), target);
				}
			}

			return name;
		}

		private void InitializeTranscription(string taskId, XmlNode taskNode, string apiFolder)
		{
			var idName = Path.GetFileNameWithoutExtension(taskId);
			var eafName = idName + ".eaf";
			var folder = Util.FileFolder(idName);
			var eafFullName = Path.Combine(folder, eafName);
			if (!File.Exists(eafFullName))
				return;

			var eafDoc = new XmlDocument();
			using (var xr = XmlReader.Create(eafFullName))
			{
				eafDoc.Load(xr);
			}

			var transcriptionDoc = new XmlDocument();
			transcriptionDoc.LoadXml("<root/>");
			var position = taskNode.SelectSingleNode("@position")?.InnerText;
			if (position != null)
				Util.NewAttr(transcriptionDoc.DocumentElement, "position", position);
			var transcription = eafDoc.SelectSingleNode("//*[local-name()='ANNOTATION_VALUE']")?.InnerText;
			if (!string.IsNullOrEmpty(transcription))
				Util.NewChild(transcriptionDoc.DocumentElement,"transcription", transcription);

			var transcriptionJson =
				JsonConvert.SerializeXmlNode(transcriptionDoc.DocumentElement).Replace("\"@", "\"").Substring(8);
			using (var sw = new StreamWriter(Path.Combine(apiFolder, "audio", idName + ".transcription")))
			{
				sw.Write(transcriptionJson.Substring(0, transcriptionJson.Length - 1));
			}
		}

	}
}
