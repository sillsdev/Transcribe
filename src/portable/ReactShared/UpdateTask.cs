using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class UpdateTask
	{
		public static readonly Regex ReferencePattern = new Regex(@"^([A-Za-z1-3]+) ([0-9]{1,3}):([0-9]{1,3})-([0-9]{1,3})$", RegexOptions.Compiled);

		public UpdateTask(string query, byte[] requestBody)
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
			var audioData = Util.GetRequestElement(requestBody, "data");

			//Debug.Print($"{task}:{project}:{audioFile}:{reference}:{heading}:{assignedTo}:{timeDuration}");
			var tasksDoc = Util.LoadXmlData("tasks");
			var projectNode = tasksDoc.SelectSingleNode($"//project[@id='{project}']") as XmlElement;
			if (projectNode == null)
				return;
			if (string.IsNullOrEmpty(taskId))
			{
				var refMatch = ReferencePattern.Match(reference);
				if (refMatch.Success)
				{
					taskId = $"{project}-{refMatch.Groups[1].Value}-{int.Parse(refMatch.Groups[2].Value):D3}-{int.Parse(refMatch.Groups[3].Value):D3}{int.Parse(refMatch.Groups[4].Value):D3}";
				}
				else if (!string.IsNullOrEmpty(audioFile))
				{
					taskId = $"{project}-{Path.GetFileNameWithoutExtension(audioFile).Replace(" ", "")}";
				}
				else
				{
					var allTaskNodes = tasksDoc.SelectNodes($"//project[@id='{project}']/task");
					taskId = $"{project}-{allTaskNodes.Count:D3}";
				}
			}

			CreateAudioFile(taskId, audioFile, audioData);

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
			Util.UpdateAttr(taskNode, "assignedto", assignedTo);
			Util.UpdateAttr(taskNode, "length", timeDuration);
			var state = taskNode.SelectSingleNode("./@state") as XmlAttribute;
			if (state == null || string.IsNullOrEmpty(state.InnerText))
				Util.UpdateAttr(taskNode, "state", "Transcribe");
			
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
			var files = dirInfo.GetFiles(taskId + "*.*");
			var seq = files.Length;
			string fullPath;
			while (true)
			{
				seq += 1;
				fullPath = Path.Combine(folder, $"{taskId}v{seq:D2}{Path.GetExtension(fileName)}");
				if (!File.Exists(fullPath))
					break;
			}

			var audioParts = audioData.Split(',').ToList();
			if (audioParts.Count <= 1)
				return;
			var dummyData = audioParts[1].Trim().Replace(" ", "+");
			if (dummyData.Length % 4 > 0)
				dummyData = dummyData.PadRight(dummyData.Length + 4 - dummyData.Length % 4, '=');
			var bytes = Convert.FromBase64String(dummyData);

			using (var ms = new MemoryStream(bytes))
			{
				var buffer = new byte[1000];
				using (var os = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
				{
					int count;
					do
					{
						count = ms.Read(buffer, 0, 1000);
						os.Write(buffer, 0, count);
					} while (count > 0);
				}
			}
		}
	}
}