using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using Gecko;
using ReactShared;
using SIL.Reporting;

namespace Transcribe.Windows
{
	public class TrappingGecko : GeckoWebBrowser
	{
		protected override void OnObserveHttpModifyRequest(GeckoObserveHttpModifyRequestEventArgs e)
		{
			Debug.Print(e.Uri.AbsoluteUri);
			var method = e.Channel.RequestMethod;
			if (method == "GET")
			{
				if (e.Uri.Segments.Length < 2 || e.Uri.Segments[1] != "api/")
					return;
				switch (e.Uri.Segments[2])
				{
					case "GetUsers":
						new GetUsers();
						break;
					case "GetTasks":
						new GetTasks(e.Uri.Query);
						break;
					case "GetParatextProjects":
						ForParatext.GetParatextProjects();
						break;
					case "GetDefaultUserHotKeys":
						new GetDefaultUserHotKeys();
						break;
				}
			}
			else if (method == "PUT")
			{
				if (e.Uri.Segments.Length < 2 || e.Uri.Segments[1] != "api/")
					return;
				switch (e.Uri.Segments[2])
				{
					case "TaskEvent":
						var taskEvent = new TaskEvent();
						if (taskEvent.Exec(e.Uri.Query, ForParatext.Upload))
							e.Cancel = true;
						break;
					case "UpdateUser":
						new UpdateUser(e.Uri.Query);
						break;
					case "UpdateAvatar":
						new UpdateAvatar(e.Uri.Query, e.RequestBody, SaveImage);
						break;
					case "UpdateProject":
						new UpdateProject(e.Uri.Query);
						break;
					case "ReportPosition":
						new ReportPosition(e.Uri.Query);
						break;
					case "WriteTranscription":
						new WriteTranscription(e.Uri.Query, e.RequestBody);
						break;
					case "DeleteUser":
						new DeleteUser(e.Uri.Query);
						break;
					case "UpdateTask":
						new UpdateTask(e.Uri.Query, e.RequestBody);
						break;
					case "DeleteTask":
						new DeleteTask(e.Uri.Query);
						break;
				}
			}
		}

		private void SaveImage(string data, string filepath)
		{
			var newAvatarImage = LoadImage(data);
			newAvatarImage.Save(filepath);
		}

		private Image LoadImage(string avatarUriString)
		{
			Image image = null;
			var imageParts = avatarUriString.Split(',').ToList<string>();
			try
			{
				string dummyData = imageParts[1].Trim().Replace(" ", "+");
				if (dummyData.Length % 4 > 0)
					dummyData = dummyData.PadRight(dummyData.Length + 4 - dummyData.Length % 4, '=');
				var bytes = Convert.FromBase64String(dummyData);

				using (MemoryStream ms = new MemoryStream(bytes))
				{
					image = Image.FromStream(ms);
				}
			}
			catch (Exception err)
			{
				Logger.WriteEvent($"LoadImage error: {err.Message}");
			}

			return image;
		}

	}
}
