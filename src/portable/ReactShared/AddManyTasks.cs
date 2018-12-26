using System;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using ExcelDataReader;

namespace ReactShared
{
	public class AddManyTasks
	{
		private static readonly Regex RegexBreaks = new Regex("([0-9]{1,3}):([0-9]{1,3})[abc]*-?([0-9]{0,3})[abc]*", RegexOptions.IgnoreCase | RegexOptions.Singleline);
		private static readonly Regex RegexReference = new Regex("[A-Za-z0-9]{3}-[0-9]{3}-[0-9]{6}", RegexOptions.IgnoreCase | RegexOptions.Singleline);

		public delegate string SelectAudioFilesFolder();

		public AddManyTasks(string query, SelectAudioFilesFolder selectAudioFolder, string audioFolderPath="")
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var user = parsedQuery["user"];
			var project = parsedQuery["project"];

			var audioFolder = "";
			if (!string.IsNullOrEmpty(audioFolderPath))
			{
				audioFolder = audioFolderPath;
			}
			else
			{
				// Opens up the FolderBrowserDialog to select a folder
				audioFolder = selectAudioFolder();
			}

			StringBuilder summary = new StringBuilder();
			var allExcelFiles = Directory.GetFiles(audioFolder, "*.xlsx", SearchOption.AllDirectories)
				.Where(str => !str.Contains(@"\~$")).ToArray();
			if (allExcelFiles.Length > 0)
			{
				var excelFile = allExcelFiles[0];
				using (var stream = File.Open(excelFile, FileMode.Open, FileAccess.Read))
				{
					using (IExcelDataReader reader = ExcelReaderFactory.CreateReader(stream))
					{
						// AsDataSet extension method
						var result = reader.AsDataSet(new ExcelDataSetConfiguration()
						{
							ConfigureDataTable = (_) => new ExcelDataTableConfiguration()
							{
								UseHeaderRow = true
							}
						});

						// The result of each spreadsheet is in result.Tables
						var sheet1Table = result.Tables[0];
						foreach (DataRow row in sheet1Table.Rows)
						{
							var status = CreateTaskFromRow(user, project, audioFolder, row);
							summary.AppendLine(status[0] + ". " + status[1] + ".");
						}
					}
				}
			}
			else if (allExcelFiles.Length == 0)
			{
				// Select the .mp3 files and .wav files
				var allAudioFiles = Directory.EnumerateFiles(audioFolder, "*.*", SearchOption.AllDirectories)
					.Where(s => s.EndsWith(".mp3", StringComparison.OrdinalIgnoreCase) ||
					            s.EndsWith(".wav", StringComparison.OrdinalIgnoreCase));
				foreach (string aFile in allAudioFiles)
				{
					var status = CreateTaskFromFile(user, project, aFile);
					if (status[0] != string.Empty || status[1] != string.Empty)
					{
						summary.AppendLine(status[0] + ". " + status[1] + ".");
					}
				}
			}
			using (var tw = new StreamWriter(Path.Combine(audioFolder, "Summary.txt"),false))
			{
				tw.Write(summary);
			}

			if (string.IsNullOrEmpty(audioFolderPath))
			{
				Process.Start(Path.Combine(audioFolder, "Summary.txt"));
			}
		}

		/// <summary>
		/// Creates a Task from an Excel Row
		/// </summary>
		/// <param name="user"></param>
		/// <param name="project"></param>
		/// <param name="audioFolder"></param>
		/// <param name="row"></param>
		/// <returns>status details</returns>
		private string[] CreateTaskFromRow(string user, string project, string audioFolder, DataRow row)
		{
			string[] status = new string[] {"", ""};
			Task theTask = new Task();
			try
			{
				theTask.Project = project;
				theTask.BookName = row["Book"].ToString().Trim();
				if (!IsBookNameValid(theTask.BookName, ref status))
				{
					return status;
				}
				var breaks = row["Breaks"].ToString();
				if (!IsBreaksValid(breaks, ref theTask, ref status))
				{
					return status;
				}
				theTask.Heading = row["Description"].ToString().Trim();
				var queryString = "user=" + user + "&project=" + project + "&task=" + "&reference=" + theTask.Reference +
					                "&heading=" +
					                theTask.Heading;
				var mp3AudioFileName = Path.Combine(audioFolder, theTask.AudioFileNameWithoutProjectName + ".mp3");
				var wavAudioFileName = Path.Combine(audioFolder, theTask.AudioFileNameWithoutProjectName + ".wav");

				if (File.Exists(mp3AudioFileName))
				{
					status[1] = "Corresponding .mp3 Audio File " + Path.GetFileName(mp3AudioFileName) +
						        " Exists in the Selected Folder";
					new UpdateTask(queryString, null, mp3AudioFileName);
					status[0] = "Task with reference " + theTask.Reference + " created successfully";
				}
				else if (File.Exists(wavAudioFileName))
				{
					status[1] = "Corresponding .wav Audio File " + Path.GetFileName(wavAudioFileName) +
						        " Exists in the Selected Folder";
					new UpdateTask(queryString, null, wavAudioFileName);
					status[0] = "Task with reference " + theTask.Reference + " created successfully";
				}
				else
				{
					status[1] = "No Corresponding Audio File Exists";
					new UpdateTask(queryString, null, "");
					status[0] = "Task with reference " + theTask.Reference + " created successfully";
				}
			}
			catch (Exception ex)
			{
				status[1] = ex.Message;
				status[0] = "Error in Book: " + row["Book"] + " Breaks: " + row["Breaks"] + ". Task with Reference " + theTask.Reference + " not created successfully";
			}

			return status;
		}

		/// <summary>
		/// Creates a Task from an Audio File if the File Name matches the Pattern
		/// </summary>
		/// <param name="user"></param>
		/// <param name="project"></param>
		/// <param name="audioFile"></param>
		/// <returns>status details</returns>
		private string[] CreateTaskFromFile(string user, string project, string audioFile)
		{
			var status = new [] {"", ""};
			try
			{
				var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(audioFile);

				Match m = RegexReference.Match(fileNameWithoutExtension);
				if (m.Success)
				{
					// example pattern GEN-001-001005
					var fileNameWithoutExtensionParts = fileNameWithoutExtension.Split('-');
					var reference = fileNameWithoutExtensionParts[0] + " " +
					                Convert.ToInt16(fileNameWithoutExtensionParts[1]) + ":" +
					                Convert.ToInt16(fileNameWithoutExtensionParts[2].Substring(0, 3)) + "-" +
					                Convert.ToInt16(fileNameWithoutExtensionParts[2].Substring(3, 3));

					var queryString = "user=" + user + "&project=" + project + "&task=" + project + "-" + fileNameWithoutExtension + "&reference=" +
					                  reference + "&heading=";
					status[1] = "Audio File " + Path.GetFileName(audioFile) + " Exists in the Selected Folder";
					new UpdateTask(queryString, null, audioFile);
					status[0] = "Task with reference " + reference + " created successfully";
				}
			}
			catch (Exception ex)
			{
				status[1] = ex.Message;
				status[0] = "Task From Audio File " + Path.GetFileName(audioFile) + " not created successfully";
			}

			return status;
		}

		/// <summary>
		/// Checks if there is book name in excel row
		/// </summary>
		/// <param name="bookName"></param>
		/// <param name="status"></param>
		/// <returns>true if book name exists</returns>
		private bool IsBookNameValid(string bookName, ref string[] status)
		{
			bool isValid = true;
			if (bookName == string.Empty)
			{
				status[1] = "Book Column value " + bookName + " in the Excel File Row is Empty";
				status[0] = "Error: Task not created successfully";
				isValid = false;
			}
			return isValid;
		}

		/// <summary>
		/// Checks if the breaks value in excel row is valid
		/// </summary>
		/// <param name="breaks">reference text being parsed</param>
		/// <param name="theTask">Contains reference information if successful</param>
		/// <param name="status">Contains error if unsuccessful</param>
		/// <returns>true if valid breaks value</returns>
		private bool IsBreaksValid(string breaks, ref Task theTask, ref string[] status)
		{
			var m = RegexBreaks.Match(breaks);
			if (!m.Success)
			{
				status[1] = "Breaks Column value " + breaks + " in the Excel File Row is Invalid";
				status[0] = "Error: Task not created successfully";
				return false;
			}
			theTask.ChapterNumber = Convert.ToInt16(m.Groups[1].Value);
			theTask.VerseStart = Convert.ToInt16(m.Groups[2].Value);
			var endRef = m.Groups[3].Value;
			theTask.VerseEnd = !string.IsNullOrEmpty(endRef) ? Convert.ToInt16(endRef) : theTask.VerseStart;
			return true;
		}
	}
}
