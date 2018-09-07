namespace ReactShared
{
	public class Task
	{
		public string TaskId { get; set; }
		public string Project { get; set; }
		public string BookName { get; set; }
		public int ChapterNumber { get; set; }
		public int VerseStart { get; set; }
		public int VerseEnd { get; set; }

		public string VerseFormat
		{
			get => (@"\v " + VerseStart + "-" + VerseEnd);
		}

		public Task()
		{

		}

		public Task GetTask(string taskId)
		{
			Task theTask = new Task();
			string[] taskSplit = taskId.Split('-');
			theTask.Project = taskSplit[0];
			theTask.BookName = taskSplit[1];
			theTask.ChapterNumber = int.Parse(taskSplit[2]);
			theTask.VerseStart = int.Parse(taskSplit[3].Substring(0, 3));
			theTask.VerseEnd = int.Parse(taskSplit[3].Substring(3, 3));

			return theTask;
		}
	}
}
