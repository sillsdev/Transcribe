using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
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
				var arg3 = e.Uri.Segments.Length > 3 ? e.Uri.Segments[3] : string.Empty;
				Logger.WriteEvent($"Get {e.Uri.Segments[2]} {e.Uri.Query} {arg3}");
				try
				{
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
						case "GetZttProjectsCount":
							new GetZttProjectsCount();
							break;
					}
				}
				catch (Exception err)
				{
					Logger.WriteEvent($"{err.Message} in {e.Uri.Segments[2]}");
				}
			}
			else if (method == "PUT")
			{
				if (e.Uri.Segments.Length < 2 || e.Uri.Segments[1] != "api/")
					return;
				Logger.WriteEvent($"Put {e.Uri.Segments[2]} {e.Uri.Query}");
				try
				{

					switch (e.Uri.Segments[2])
					{
						case "TaskEvent":
							var taskEvent = new TaskEvent();
							if (taskEvent.Exec(e.Uri.Query, ForParatext.Upload))
								e.Cancel = true;
							break;
						case "UpdateUser":
							new UpdateUser(e.Uri.Query, e.RequestBody, SaveImage);
							break;
						case "UpdateProjectAvatar":
							new UpdateProjectAvatar(e.Uri.Query, e.RequestBody, SaveImage);
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
						case "CopyToClipboard":
							new CopyToClipboard(e.Uri.Query, ToClipboard);
							break;
						case "AddManyTasks":
							new AddManyTasks(e.Uri.Query, SelectAudioFilesFolder);
							break;
						case "ShowHelp":
							new ShowHelp(e.Uri.Query, ShowHelpTopic);
							break;
						case "GetMeta":
							new GetMeta(e.Uri.Query, e.RequestBody);
							break;
					}
				}
				catch (Exception err)
				{
					Logger.WriteEvent($"{err.Message} in {e.Uri.Segments[2]}");
				}
			}
		}

		private void ToClipboard(string data)
		{
			if (!string.IsNullOrEmpty(data))
				Clipboard.SetText(data);
		}

		private void SaveImage(string data, string filepath)
		{
			var newAvatarImage = LoadImage(data);
			newAvatarImage.Save(filepath);
		}

		private string SelectAudioFilesFolder()
		{
			FolderBrowserDialog folderDlg = new FolderBrowserDialog();
			folderDlg.Description = "Select the Folder with the Audio File";

			string folderName = "";

			// Show the Dialog.
			// If the user clicked OK in the dialog and
			// a folder was selected, set the folder name
			if (folderDlg.ShowDialog() == System.Windows.Forms.DialogResult.OK)
			{
				folderName = folderDlg.SelectedPath;
			}

			return folderName;
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

		private void ShowHelpTopic(string topic, string helpFileName)
		{
			Help.ShowHelp(this, helpFileName, topic);
		}

	}
}
