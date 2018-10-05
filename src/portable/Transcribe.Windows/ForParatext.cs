using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;
using Paratext.Data;
using Paratext.Data.ProjectSettingsAccess;
using ReactShared;
using SIL.Reporting;
using SIL.Scripture;

namespace Transcribe.Windows
{
	public class ForParatext : ParatextUpdate
	{
		/// <summary>
		/// The Transcribed Data is moved to Paratext SFM
		/// </summary>
		/// <param name="taskId">Task Id</param>
		/// <returns>true if upload successful</returns>
		public static bool Upload(string taskId)
		{
			if (!ParatextInfo.IsParatextInstalled)
			{
				return false;
			}

			try
			{
				// Get Task Details
				var currentTask = new Task();
				currentTask = currentTask.GetTask(taskId);

				// Get the Task Transcription Text from EAF
				var folder = Util.FileFolder(taskId);
				string eafFilePath = Path.Combine(folder, Path.GetFileNameWithoutExtension(taskId) + ".eaf");

				var transcriptionArray = GetTranscriptionTextFromEAF(eafFilePath);
				if (transcriptionArray[0].Trim().ToUpper().StartsWith("File Error:"))
					return false;
				ParatextData.Initialize();
				var paratextProject = ScrTextCollection.Find(currentTask.Project);
				if (paratextProject == null)
					return false;

				var bookNum =
					paratextProject.BookNames.ScrText.BookNames.GetBookNumFromName(currentTask.BookName, true,
						BookNameSource.Abbreviation);
				if (bookNum == 0)
				{
					bookNum = (from i in paratextProject.BookNames.GetBookNames()
							   where i.BookCode == currentTask.BookName
							   select i.BookNum).FirstOrDefault();
				}

				var vRef = new VerseRef(bookNum, currentTask.ChapterNumber, Convert.ToInt32(currentTask.VerseStart),
					paratextProject.Settings.Versification);

				var chapterContent = paratextProject.GetText(vRef, true, true);

				var heading = string.Empty;
				var taskMatch = Util.TaskIdPattern.Match(taskId);
				var currtaskId = taskMatch.Success ? taskMatch.Groups[1].Value : taskId;
				var tasksDoc = Util.LoadXmlData("tasks");
				var taskNode = tasksDoc.SelectSingleNode($"//project[@id='{currentTask.Project}']/task[@id='{Path.GetFileNameWithoutExtension(currtaskId)}']") as XmlElement;
				if (taskNode != null)
				{
					heading = taskNode.InnerText;
				}

				var sb = GenerateParatextData(currentTask, chapterContent, transcriptionArray[1], heading);

				paratextProject.PutText(bookNum, currentTask.ChapterNumber, true, sb.ToString(), null);
				return true;
			}
			catch (Exception ex)
			{
				var error = ex.Message;
				Debug.Print(error);
				Logger.WriteEvent(ex.Message);
			}

			return false;
		}


		public static void GetParatextProjects()
		{
			var apiFolder = Util.ApiFolder();
			if (!ParatextInfo.IsParatextInstalled)
			{
				return;
			}

			try
			{
				ParatextData.Initialize();
				var paratextProjects = ScrTextCollection.ScrTexts(IncludeProjects.ScriptureOnly);
				if (paratextProjects == null)
					return;

				var jsonList = ParatextProjectsJsonList(paratextProjects);

				using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetParatextProjects")))
				{
					sw.Write($"[{string.Join(",", jsonList)}]");
				}
			}
			catch (Exception ex)
			{
				string error = ex.Message;
				Logger.WriteEvent(error);
			}
		}

		private static List<string> ParatextProjectsJsonList(IEnumerable<ScrText> paratextProjects)
		{
			var jsonList = new List<string>();
			var jsonString = new StringBuilder();
			foreach (var aProject in paratextProjects)
			{
				jsonString = new StringBuilder();
				jsonString.Append("{\"id\": \"" + aProject.Name + "\",");
				jsonString.Append("\"name\": \"" + aProject.Settings.FullName + "\",");
				jsonString.Append("\"guid\": \"" + aProject.Settings.Guid + "\",");
				jsonString.Append("\"lang\": \"" + aProject.Language.LanguageId.Id + "\",");
				jsonString.Append("\"langName\": \"" + aProject.Settings.LanguageName + "\",");
				jsonString.Append("\"font\": \"" + aProject.Settings.DefaultFont + "\",");
				jsonString.Append("\"features\": \"" + aProject.Settings.DefaultFontFeatures + "\",");
				jsonString.Append("\"size\": \"" + aProject.Settings.DefaultFontSize + "\",");
				jsonString.Append("\"direction\": \"" + (aProject.Language.RightToLeft ? "rtl" : "ltr") + "\",");
				jsonString.Append("\"type\": \"" +
						  (aProject.Settings.TranslationInfo.Type.IsScripture() ? "Bible" : "Other") + "\"}");
				jsonList.Add(jsonString.ToString());
			}

			return jsonList;
		}
	}
}
