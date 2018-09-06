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
using SIL.Scripture;

namespace Transcribe.Windows
{
	public class ForParatext
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
				var folder = Path.Combine(Util.DataFolder, Path.GetDirectoryName(Path.Combine(taskId.Split('-'))));
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
				var sb = GenerateParatextData(currentTask, chapterContent, transcriptionArray[1]);

				paratextProject.PutText(bookNum, currentTask.ChapterNumber, true, sb.ToString(), null);
				return true;
			}
			catch (Exception ex)
			{
				var error = ex.Message;
				Debug.Print(error);
			}

			return false;
		}


		protected static StringBuilder GenerateParatextData(Windows.Task currentTask, string chapterContent, string transcription)
		{
			var sb = new StringBuilder();
			var firstIndex = 0;
			var list = chapterContent.Split(new string[] { "\\v" }, StringSplitOptions.None).ToList();

			if (!chapterContent.Contains(@"\c " + Convert.ToInt32(currentTask.ChapterNumber)))
			{
				list.Insert(1, @"\c " + Convert.ToInt32(currentTask.ChapterNumber));
			}

			var startContains = list.FirstOrDefault(f => f.StartsWith(" " + currentTask.VerseStart.ToString() + " ")
														 || f.StartsWith(" " + currentTask.VerseStart.ToString() + "-")
														 || f.StartsWith(
															 " " + currentTask.VerseStart.ToString() + "\r\n"));
			if (startContains == null)
			{
				firstIndex = InsertVerseAsNew(currentTask, null, ref list);
			}
			else if (startContains.Trim().IndexOf('-') > 0 && startContains.Trim().IndexOf('-') <= 3)
			{
				firstIndex = InsertVerseWithPericope(startContains, currentTask, firstIndex, ref list);
			}
			else
			{
				firstIndex = InsertVerseWithoutPericope(currentTask, ref list);
			}

			var verseFormat = " " + currentTask.VerseStart + "-" + currentTask.VerseEnd;
			var pContentFormat = " " + transcription + "\r\n";
			list.Insert(firstIndex, verseFormat + pContentFormat);

			for (int i = 0; i < list.Count; i++)
			{
				if (list[i].Trim().Length == 0) continue;
				if (i == 0 || list[i].Contains(@"\c " + Convert.ToInt32(currentTask.ChapterNumber)))
				{
					if (i == 0 && !list[i].EndsWith("\r\n") || i > 0)
					{
						sb.Append(list[i] + Environment.NewLine);
					}
					else
					{
						sb.Append(list[i]);
					}
				}
				else
				{
					sb.Append("\\v" + list[i]);
				}
			}

			return sb;
		}

		/// <summary>
		/// It handles the verse numbers without hyphen(-)
		/// </summary>
		/// <param name="currTask">Current Task Id</param>
		/// <param name="list">List of Verses from SFM File of the Current Chapter</param>
		/// <returns>Index of the new Verse Number</returns>
		private static int InsertVerseWithoutPericope(Windows.Task currTask, ref List<string> list)
		{
			var firstIndex = GetIndexFromList(ref list, currTask.VerseStart.ToString());
			var secondIndex = GetIndexFromList(ref list, currTask.VerseEnd.ToString());
			list.RemoveRange(firstIndex, (secondIndex - firstIndex) + 1);
			return firstIndex;
		}

		/// <summary>
		/// It handles the verse numbers with hyphen(-)
		/// </summary>
		/// <param name="startContains">Starting Verse Content</param>
		/// <param name="currTask">Current Task Id</param>
		/// <param name="firstIndex">Index of the Starting Verse</param>
		/// <param name="list">List of Verses from SFM File of the Current Chapter</param>
		/// <returns>Index of the new Verse Number</returns>
		private static int InsertVerseWithPericope(string startContains, Windows.Task currTask, int firstIndex,
			ref List<string> list)
		{
			string[] pericope = startContains.Trim().Split(' ');

			if (pericope[0] == (currTask.VerseStart + "-" + currTask.VerseEnd))
			{
				firstIndex = GetIndexFromList(ref list, pericope[0]);
				list.RemoveAt(firstIndex);
			}
			else
			{
				string[] pericopeItems = pericope[0].Split('-');
				string firstPart = pericopeItems[0];
				if (Convert.ToInt32(firstPart) >= currTask.VerseStart)
				{
					if (int.Parse(pericopeItems[1]) > currTask.VerseEnd)
					{
						firstIndex = GetIndexFromList(ref list, pericope[0]);
					}
					else
					{
						firstIndex = GetIndexFromList(ref list, pericope[0]) + 1;
					}
				}
				else if (Convert.ToInt32(firstPart) < Convert.ToInt32(currTask.VerseStart))
				{
					firstIndex = GetIndexFromList(ref list, pericope[0]) - 1;
				}
			}

			return firstIndex;
		}

		/// <summary>
		/// It handles verse numbers that does not exist already in the SFM File
		/// </summary>
		/// <param name="currTask">Current Task Id</param>
		/// <param name="startContains">Starting Verse Content</param>
		/// <param name="list">List of Verses from SFM File of the Current Chapter</param>
		/// <returns>Index of the new Verse Number</returns>
		private static int InsertVerseAsNew(Task currTask, string startContains, ref List<string> list)
		{
			int firstIndex;
			for (int i = currTask.VerseStart - 1; i > 0; i--)
			{
				startContains = list.FirstOrDefault(f => f.Trim().StartsWith(i.ToString()));
				if (startContains != null)
					break;
			}

			if (startContains != null)
			{
				string[] pericope = startContains.Trim().Split(' ');
				firstIndex = GetIndexFromList(ref list, pericope[0]) + 1;
			}
			else
			{
				firstIndex = list.Count;
			}

			return firstIndex;
		}

		/// <summary>
		/// Gets Index of the Verse Range of the Transcribed Data from the Verses List
		/// </summary>
		/// <param name="verseList">List of Verses from SFM File of the Current Chapter</param>
		/// <param name="searchString">Verse Range of the Transcribed Data</param>
		/// <returns>Index of the Verse Range</returns>
		private static int GetIndexFromList(ref List<string> verseList, string searchString)
		{
			int index = verseList.Select((c, i) => new { c, i })
				.Where(x => x.c.Trim().StartsWith(searchString))
				.Select(x => x.i).FirstOrDefault();
			return index;
		}

		/// <summary>
		/// Reads the Transcription Data of a Verse Range from the EAF File
		/// </summary>
		/// <param name="eafFilePath">EAF File Name with Full Path</param>
		/// <returns>String Array with Transcription Data and Error in case of failure</returns>
		private static string[] GetTranscriptionTextFromEAF(string eafFilePath)
		{
			string[] theTranscriptionText = { "", "" };
			if (!File.Exists(eafFilePath))
			{
				theTranscriptionText[0] = "File Error:";
				theTranscriptionText[1] = eafFilePath + " does not exist. Please check.";
			}
			else
			{
				var eafDoc = new XmlDocument();
				using (var xr = XmlReader.Create(eafFilePath))
				{
					eafDoc.Load(xr);
					theTranscriptionText[0] = "";
					theTranscriptionText[1] =
						eafDoc.SelectSingleNode("//*[local-name()='ANNOTATION_VALUE']")?.InnerText;
				}
			}

			return theTranscriptionText;
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
