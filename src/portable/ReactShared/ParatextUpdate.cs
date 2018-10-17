using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml;

namespace ReactShared
{
	public class ParatextUpdate
	{
		protected static StringBuilder GenerateParatextData(Task currentTask, string chapterContent, string transcription, string heading = "")
		{
			var sb = new StringBuilder();
			var firstIndex = 0;
			var list = chapterContent.Split(new[] { "\\v" }, StringSplitOptions.None).ToList();

			if (!chapterContent.Contains(@"\c " + Convert.ToInt32(currentTask.ChapterNumber)))
			{
				list.Insert(1, @"\c " + Convert.ToInt32(currentTask.ChapterNumber));
			}

			var startContains = list.FirstOrDefault(f => f.TrimStart().StartsWith(currentTask.VerseStart.ToString() + " ")
														 || f.TrimStart().StartsWith(currentTask.VerseStart.ToString() + "-")
														 || f.TrimStart().StartsWith(currentTask.VerseStart.ToString() + "\r\n"));
			if (startContains == null)
			{
				firstIndex = InsertVerseAsNew(currentTask, null, ref list);
			}
			else if (startContains.Trim().IndexOf('-') > 0 && startContains.Trim().IndexOf('-') <= 4)
			{
				firstIndex = InsertVerseWithRange(startContains, currentTask, firstIndex, ref list);
			}
			else
			{
				firstIndex = InsertVerseWithoutRange(currentTask, ref list);
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
						sb.Append(list[i].Trim() + Environment.NewLine);
					}
					else
					{
						sb.Append(list[i]);
					}
				}
				else
				{
					if (i == firstIndex)
					{
						sb.Append(heading != string.Empty
							? $@"\s1 {heading}{Environment.NewLine}\p \v{list[i]}"
							: $@"\v{list[i]}");
					}
					else
					{
						if (i == firstIndex - 1)
						{
							var previousVerse = list[i];
							if (heading != string.Empty)
							{
								var sectionPosition = previousVerse.IndexOf("\\s", StringComparison.InvariantCulture);
								if (sectionPosition > 0)
								{
									list[i] = previousVerse.Replace(previousVerse.Substring(sectionPosition, previousVerse.Length - sectionPosition), "");
								}
							}
						}
						sb.Append($@"\v{list[i]}");
					}
				}
			}

			return sb;
		}

		/// <summary>
		/// It handles the verse numbers without hyphen(-)
		/// </summary>
		/// <param name="currentTask">Current Task Id</param>
		/// <param name="list">List of Verses from SFM File of the Current Chapter</param>
		/// <returns>Index of the new Verse Number</returns>
		private static int InsertVerseWithoutRange(Task currentTask, ref List<string> list)
		{
			var firstIndex = GetIndexFromList(ref list, currentTask.VerseStart.ToString());
			var secondIndex = GetIndexFromList(ref list, currentTask.VerseEnd.ToString());
			list.RemoveRange(firstIndex, (secondIndex - firstIndex) + 1);
			return firstIndex;
		}

		/// <summary>
		/// It handles the verse numbers with hyphen(-)
		/// </summary>
		/// <param name="startContains">Starting Verse Content</param>
		/// <param name="currentTask">Current Task Id</param>
		/// <param name="firstIndex">Index of the Starting Verse</param>
		/// <param name="list">List of Verses from SFM File of the Current Chapter</param>
		/// <returns>Index of the new Verse Number</returns>
		private static int InsertVerseWithRange(string startContains, Task currentTask, int firstIndex,
			ref List<string> list)
		{
			string[] verseParts = startContains.Trim().Split(' ');

			if (verseParts[0] == (currentTask.VerseStart + "-" + currentTask.VerseEnd))
			{
				firstIndex = GetIndexFromList(ref list, verseParts[0]);
				list.RemoveAt(firstIndex);
			}
			else
			{
				string[] rangeItems = verseParts[0].Split('-');
				string firstPart = rangeItems[0];
				if (Convert.ToInt32(firstPart) >= currentTask.VerseStart)
				{
					if (int.Parse(rangeItems[1]) > currentTask.VerseEnd)
					{
						firstIndex = GetIndexFromList(ref list, verseParts[0]);
					}
					else
					{
						firstIndex = GetIndexFromList(ref list, verseParts[0]) + 1;
					}
				}
				else if (Convert.ToInt32(firstPart) < Convert.ToInt32(currentTask.VerseStart))
				{
					firstIndex = GetIndexFromList(ref list, verseParts[0]) - 1;
				}
			}

			return firstIndex;
		}

		/// <summary>
		/// It handles verse numbers that does not exist already in the SFM File
		/// </summary>
		/// <param name="currentTask">Current Task Id</param>
		/// <param name="startContains">Starting Verse Content</param>
		/// <param name="list">List of Verses from SFM File of the Current Chapter</param>
		/// <returns>Index of the new Verse Number</returns>
		private static int InsertVerseAsNew(Task currentTask, string startContains, ref List<string> list)
		{
			int firstIndex;
			for (int i = currentTask.VerseStart - 1; i > 0; i--)
			{
				startContains = list.FirstOrDefault(f => f.Trim().StartsWith(i.ToString()));
				if (startContains != null)
					break;
			}

			if (startContains != null)
			{
				string[] verseParts = startContains.Trim().Split(' ');
				firstIndex = GetIndexFromList(ref list, verseParts[0]) + 1;
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
		protected static string[] GetTranscriptionTextFromEaf(string eafFilePath)
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

	}
}
