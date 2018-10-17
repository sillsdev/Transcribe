using System;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class CopyAudio
	{
		public CopyAudio(string query, byte[] requestBody)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var task = parsedQuery["task"];
			var taskMatch = Util.TaskIdPattern.Match(task);
			var taskId = taskMatch.Success ? taskMatch.Groups[1].Value : task;
			var project = parsedQuery["project"];
			var audioFile = parsedQuery["audioFile"];
			var audioData = Util.GetRequestElement(requestBody, "data");
			if (audioData.Trim().Length == 0) return;
			//Debug.Print($"{task}:{project}:{audioFile}");
			var tasksDoc = Util.LoadXmlData("tasks");
			var projectNode = tasksDoc.SelectSingleNode($"//project[@id='{project}']") as XmlElement;
			if (projectNode == null)
				return;
			if (string.IsNullOrEmpty(taskId))
			{
				if (!string.IsNullOrEmpty(audioFile))
				{
					taskId = $"{project}-{Path.GetFileNameWithoutExtension(audioFile).Replace(" ", "")}";
				}
				else
				{
					var allTaskNodes = tasksDoc.SelectNodes($"//project[@id='{project}']/task");
					taskId = $"{project}-{allTaskNodes.Count:D3}";
				}
			}
			CreateAudioFileToTemp(taskId, audioFile, audioData);
		}

		private void CreateAudioFileToTemp(string taskId, string fileName, string audioData)
		{
			var apiFolder = Util.ApiFolder();
			var audioFolder = Path.Combine(apiFolder, "audio");
			audioFolder = Path.Combine(audioFolder, "dummy");
			if (!Directory.Exists(audioFolder))
				Directory.CreateDirectory(audioFolder);
			var dirInfo = new DirectoryInfo(audioFolder);
			if (!dirInfo.Exists)
				return;

			var files = dirInfo.GetFiles(taskId + "*.*");
			string fullPath;
			while (true)
			{
				fullPath = Path.Combine(audioFolder, $"{taskId.Replace(" ", "")}{Path.GetExtension(fileName)}");
				if (!File.Exists(fullPath))
				{
					break;
				}
				else {
					File.Delete(fullPath);
				}
			}
			Util.CreateFileFromBase64Data(audioData, fullPath);
		}
	}
}