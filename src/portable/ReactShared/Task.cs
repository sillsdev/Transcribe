namespace ReactShared
{
	public class Task
	{
		public string Project { get; set; }
		public string BookName { get; set; }
		public int ChapterNumber { get; set; }
		public int VerseStart { get; set; }
		public int VerseEnd { get; set; }
		public string Heading { get; set; }

		public string AudioFileNameWithoutProjectName =>
			$"{BookName.Substring(0, 3)}-{ChapterNumber:D3}-{VerseStart:D3}{VerseEnd:D3}";

		public string Reference =>
			$"{BookName.Substring(0, 3)} {ChapterNumber}:{VerseStart}-{VerseEnd}";

		public Task GetTask(string taskId)
		{
			var theTask = new Task();
			var taskSplit = taskId.Split('-');
			theTask.Project = taskSplit[0];
			theTask.BookName = taskSplit[1];
			theTask.ChapterNumber = int.Parse(taskSplit[2]);
			theTask.VerseStart = int.Parse(taskSplit[3].Substring(0, 3));
			theTask.VerseEnd = int.Parse(taskSplit[3].Substring(3, 3));

			return theTask;
		}
	}
}
