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
			var userNode = Util.UserNode(user);
			var apiFolder = Util.ApiFolder();
			var tasksDoc = Util.LoadXmlData("tasks");
			var projectXpath = string.IsNullOrEmpty(project)?
				"//*[local-name()='project']":
				$"//*[local-name()='project' and @id='{project}']";
			var projectNodes = tasksDoc.SelectNodes(projectXpath);
			Debug.Assert(projectNodes != null, nameof(projectNodes) + " != null");
			var taskList = new List<string>();
			foreach (XmlNode node in projectNodes)
			{
				var filterNodeList = new List<XmlNode>();
				var taskNodes = node.SelectNodes(".//*[local-name() = 'task']");
				if (!string.IsNullOrEmpty(user))
					TaskSkillFilter(taskNodes, ref filterNodeList, userNode, user);
				else
				{
					foreach (XmlNode tNode in taskNodes)
					{
						filterNodeList.Add(tNode);
					}
				}
				if (filterNodeList.Count == 0)
					if (user != null && user != "admin")
						continue;
					else
					{
						var emptyTaskNode = tasksDoc.CreateElement("task");
						node.AppendChild(emptyTaskNode);
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

				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Substring(11);
				taskList.Add(jsonContent.Substring(0, jsonContent.Length - 1));
			}

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetTasks")))
			{
				sw.Write($"[{string.Join(",", taskList)}]".Replace("{}", ""));
			}
		}

		private void TaskSkillFilter(XmlNodeList taskNodes, ref List<XmlNode> filterNodeList, XmlNode userNode, string userName)
		{
			var skill = userNode?.SelectSingleNode("./@skill")?.InnerText;
			switch (skill)
			{
				case "trainee":
					foreach (XmlNode node in taskNodes)
					{
						var projectType = node.SelectSingleNode("./parent::*/@type")?.InnerText;
						if (!string.IsNullOrEmpty(projectType) && projectType == "test")
						{
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
							filterNodeList.Add(node);
						}
					}
					break;
			}
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
			{
				var transcriptionNode = transcriptionDoc.CreateElement("transcription");
				transcriptionNode.InnerText = transcription;
				Debug.Assert(transcriptionDoc.DocumentElement != null, "transcriptionDoc.DocumentElement != null");
				transcriptionDoc.DocumentElement.AppendChild(transcriptionNode);
			}

			var transcriptionJson =
				JsonConvert.SerializeXmlNode(transcriptionDoc.DocumentElement).Replace("\"@", "\"").Substring(8);
			using (var sw = new StreamWriter(Path.Combine(apiFolder, "audio", idName + ".transcription")))
			{
				sw.Write(transcriptionJson.Substring(0, transcriptionJson.Length - 1));
			}
		}

	}
}
