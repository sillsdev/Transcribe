using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
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
			var filterOption = parsedQuery["option"];
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
				if (!string.IsNullOrEmpty(user) && filterOption != @"alltasks")
				{
					TaskSkillFilter(taskNodes, ref filterNodeList, userNode, user, claim);
					TaskHistoryFilter(taskNodes, ref filterNodeList, userNode, user, filterOption);
				}
				else
				{
					if (taskNodes != null)
						foreach (XmlNode tNode in taskNodes)
						{
							filterNodeList.Add(tNode);
						}
				}

				if (filterNodeList.Count == 0)
				{
					var emptyTaskNode = Util.NewChild(node, "task");
					Util.AsArray(new List<XmlNode> { emptyTaskNode });
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

				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"false\"", "false")
					.Replace("\"true\"", "true").Replace("\"@", "\"").Substring(11);
				taskList.Add(jsonContent.Substring(0, jsonContent.Length - 1));
			}
			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetTasks")))
			{
				sw.Write($"[{string.Join(",", taskList)}]".Replace("{}", ""));
			}
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

		private void TaskHistoryFilter(XmlNodeList taskNodes, ref List<XmlNode> filterNodeList, XmlNode userNode, string userName, string filterOption)
		{
			foreach (XmlNode node in taskNodes)
			{
				if (filterNodeList.Contains(node))
					continue;
				var taskHistory = node.SelectNodes("./history");
				if (taskHistory != null)
					foreach (XmlNode historyNode in taskHistory)
					{
						if (historyNode.Attributes == null)
							continue;

						if (int.Parse(historyNode.Attributes["id"].Value) == taskHistory.Count)
						{
							break;
						}
						var assignedTo = historyNode.Attributes["userid"].Value;
						var action = historyNode.Attributes["action"].Value;
						if (string.IsNullOrEmpty(assignedTo) || assignedTo == userName)
						{
							if ((action.ToLower() == "transcribeend" || action.ToLower() == "reviewend"))
								filterNodeList.Add(node);
						}
					}
			}

		}

		private bool isUserRole(XmlNode userNode, string state)
		{
			return
				((state.ToLower() == "transcribe" || state.ToLower() == "review" || state.ToLower() == "upload" || state.ToLower() == "complete") &&
				 userNode.SelectSingleNode("./role/text()[.='transcriber']") != null) ||
				((state.ToLower() == "transcribe" || state.ToLower() == "review" || state.ToLower() == "upload" || state.ToLower() == "complete") &&
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
				Util.NewChild(transcriptionDoc.DocumentElement, "transcription", transcription);

			var transcriptionJson =
				JsonConvert.SerializeXmlNode(transcriptionDoc.DocumentElement).Replace("\"@", "\"").Substring(8);
			using (var sw = new StreamWriter(Path.Combine(apiFolder, "audio", idName + ".transcription")))
			{
				sw.Write(transcriptionJson.Substring(0, transcriptionJson.Length - 1));
			}
		}

	}
}
