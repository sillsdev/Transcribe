﻿using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class UpdateTask
	{
		public static readonly Regex ReferencePattern = new Regex(@"^([A-Za-z1-3]+) ([0-9]{1,3})(:|\.)([0-9]{1,3})(-|,)([0-9]{1,3})$", RegexOptions.Compiled);

		public UpdateTask(string query, byte[] requestBody, string audioFileNameWithPath=null)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var task = parsedQuery["task"];
			var taskMatch = Util.TaskIdPattern.Match(task);
			var taskId = taskMatch.Success ? taskMatch.Groups[1].Value : task;

			var project = parsedQuery["project"];
			var audioFile = parsedQuery["audioFile"];
			var reference = parsedQuery["reference"];
			var heading = parsedQuery["heading"];
			var assignedTo = parsedQuery["assignedTo"];
			var timeDuration = parsedQuery["timeDuration"];
			var taskState = parsedQuery["state"];
			string audioData = audioFileNameWithPath ?? Util.GetRequestElement(requestBody, "data");

			//Debug.Print($"{task}:{project}:{audioFile}:{reference}:{heading}:{assignedTo}:{timeDuration}");
			var tasksDoc = Util.LoadXmlData("tasks");
			var projectNode = tasksDoc.SelectSingleNode($"//project[@id='{project}']") as XmlElement;
			if (projectNode == null)
				return;

			var	projectGuid = projectNode.Attributes["guid"].InnerText;
			var	isAdhocProject = (string.IsNullOrEmpty(projectGuid.Trim())) ? true : false;

			if (string.IsNullOrEmpty(taskId))
			{
				if (reference == null)
					reference = "";
				var refMatch = ReferencePattern.Match(reference);
				if (refMatch.Success)
				{
					taskId = $"{project}-{refMatch.Groups[1].Value}-{int.Parse(refMatch.Groups[2].Value):D3}-{int.Parse(refMatch.Groups[4].Value):D3}{int.Parse(refMatch.Groups[6].Value):D3}";
				}
				else if (!string.IsNullOrEmpty(audioFile))
				{
					audioFile = audioFile.Replace(" ", "").Replace("-", "");
					taskId = $"{project}-{Path.GetFileNameWithoutExtension(audioFile)}";
				}
				else
				{
					var allTaskNodes = tasksDoc.SelectNodes($"//project[@id='{project}']/task");
					taskId = $"{project}-{allTaskNodes.Count:D3}";
				}
			}

			if (audioFileNameWithPath == null)
			{
				CreateAudioFile(taskId, audioFile, audioData);
			}
			else
			{
				if(audioData != string.Empty)
					CopyAudioFile(taskId, audioFile, audioData);
			}

			var taskNode = tasksDoc.SelectSingleNode($"//project[@id='{project}']/task[@id='{taskId}']") as XmlElement;
			if (taskNode == null)
			{
				taskNode = Util.NewChild(projectNode, "task");
				Util.NewAttr(taskNode, "id", taskId);
				projectNode.AppendChild(taskNode);
			}

			var taskNameNode = taskNode.SelectSingleNode("name") as XmlElement ?? 
			                   Util.NewChild(taskNode, "name");
			if (!string.IsNullOrEmpty(heading))
				taskNameNode.InnerText = heading;
			if (isAdhocProject)
			{
				var taskReferenceNode = taskNode.SelectSingleNode("reference") as XmlElement ??
				                        Util.NewChild(taskNode, "reference");
				if (!string.IsNullOrEmpty(reference))
					taskReferenceNode.InnerText = reference;
			}
			Util.UpdateAttr(taskNode, "assignedto", assignedTo, true);
			Util.UpdateAttr(taskNode, "length", timeDuration);
			var state = taskNode.SelectSingleNode("./@state") as XmlAttribute;
			if (state == null || string.IsNullOrEmpty(state.InnerText))
				Util.UpdateAttr(taskNode, "state", "Transcribe");
			if(!string.IsNullOrEmpty(taskState))
			{
				Util.UpdateAttr(taskNode, "state", taskState);
			}
			
			using (var xw = XmlWriter.Create(Util.XmlFullName("tasks"), new XmlWriterSettings {Indent = true}))
			{
				tasksDoc.Save(xw);
			}
		}

		private void CreateAudioFile(string taskId, string fileName, string audioData)
		{
			var folder = Util.FileFolder(taskId);
			var dirInfo = new DirectoryInfo(folder);
			dirInfo.Create();

			var match = Util.TaskIdPattern.Match(taskId);
			if (match.Success)
				taskId = match.Groups[1].Value;
			var files = dirInfo.GetFiles(taskId + "*.*")
				.Where(s => s.Name.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase) ||
				            s.Name.EndsWith(".wav", StringComparison.OrdinalIgnoreCase));

			var seq = files.Count();
			string fullPath;
			while (true)
			{
				seq += 1;
				fullPath = Path.Combine(folder, $"{taskId}v{seq:D2}{Path.GetExtension(fileName)}");
				if (!File.Exists(fullPath))
					break;
			}

			Util.SaveByteData(audioData, fullPath);
		}

		/// <summary>
		/// Audio File passed is directly copied to the SIL Transcriber Folder
		/// </summary>
		/// <param name="taskId"></param>
		/// <param name="fileName"></param>
		/// <param name="audioData"></param>
		private void CopyAudioFile(string taskId, string fileName, string audioData)
		{
			var folder = Util.FileFolder(taskId);
			var dirInfo = new DirectoryInfo(folder);
			dirInfo.Create();

			var match = Util.TaskIdPattern.Match(taskId);
			if (match.Success)
				taskId = match.Groups[1].Value;
			var files = dirInfo.GetFiles(taskId + "*.*");
			var seq = files.Length;
			string fullPath;
			while (true)
			{
				seq += 1;
				fullPath = Path.Combine(folder, $"{taskId}v{seq:D2}{Path.GetExtension(audioData)}");
				if (!File.Exists(fullPath))
					break;
			}
			File.Copy(audioData, fullPath, true);
		}
	}
}