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
			var userNode = Util.UserNode(user);
			var apiFolder = Util.ApiFolder();
			var tasksDoc = Util.LoadXmlData("tasks");
			var projectNodes = tasksDoc.SelectNodes("//*[local-name()='project']");
			Debug.Assert(projectNodes != null, nameof(projectNodes) + " != null");
			var taskList = new List<string>();
			foreach (XmlNode node in projectNodes)
			{
				var taskNodes = node.SelectNodes(".//*[local-name() = 'task']");
				Debug.Assert(taskNodes != null, nameof(taskNodes) + " != null");
				TaskSkillFilter(taskNodes, userNode, user);
				if (taskNodes.Count == 0)
					continue;
				Util.AsArray(taskNodes);
				foreach (XmlNode taskNode in taskNodes)
				{
					var assignedTo = taskNode.SelectSingleNode("@assignedto")?.InnerText;
					if (assignedTo != user)
						continue;
					var id = taskNode.SelectSingleNode("@id");
					var audioName = CopyAudioFile(id?.InnerText);
					if (id != null && !string.IsNullOrEmpty(audioName))
					{
						id.InnerText = audioName;
						InitializeTranscription(id.InnerText, taskNode, apiFolder);
					}
				}
				var jsonContent = JsonConvert.SerializeXmlNode(node).Replace("\"@", "\"").Substring(11);
				taskList.Add(jsonContent.Substring(0, jsonContent.Length - 1));
			}

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetTasks")))
			{
				sw.Write($"[{string.Join(",", taskList)}]");
			}
		}

		private void TaskSkillFilter(XmlNodeList taskNodes, XmlNode userNode, string userName)
		{
			var skill = userNode?.SelectSingleNode("./@skill")?.InnerText;
			switch (skill)
			{
				case "trainee":
					foreach (XmlNode node in taskNodes)
					{
						var projectType = node.SelectSingleNode("./parent::*/@type")?.InnerText;
						if (!string.IsNullOrEmpty(projectType) && projectType == "test")
							continue;
						Debug.Assert(node.ParentNode != null, "node.ParentNode != null");
						node.ParentNode.RemoveChild(node);
					}
					break;
				case "supervised":
					foreach (XmlNode node in taskNodes)
					{
						var assignedTo = node.SelectSingleNode("./@assignedto")?.InnerText;
						if (assignedTo == userName)
							continue;
						Debug.Assert(node.ParentNode != null, "node.ParentNode != null");
						node.ParentNode.RemoveChild(node);
					}
					break;
				default:
					foreach (XmlNode node in taskNodes)
					{
						var assignedTo = node.SelectSingleNode("./@assignedto")?.InnerText;
						if (string.IsNullOrEmpty(assignedTo) || assignedTo == userName)
							continue;
						Debug.Assert(node.ParentNode != null, "node.ParentNode != null");
						node.ParentNode.RemoveChild(node);
					}
					break;

			}
		}

		private string CopyAudioFile(string taskid)
		{
			var name = string.Empty;
			var folder = Path.Combine(Util.DataFolder, Path.GetDirectoryName(Path.Combine(taskid.Split('-'))));
			var apiFolder = Util.ApiFolder();
			var audioFolder = Path.Combine(apiFolder, "audio");
			if (!Directory.Exists(audioFolder))
				Directory.CreateDirectory(audioFolder);
			var dirInfo = new DirectoryInfo(folder);
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
			var folder = Path.Combine(Util.DataFolder, Path.GetDirectoryName(Path.Combine(idName.Split('-'))));
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
