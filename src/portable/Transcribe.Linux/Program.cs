using System;
using System.Windows.Forms;
using System.Drawing;
using System.IO;
using System.Diagnostics;
using System.Reflection;
using System.Threading;
using Gecko;
using ReactShared;
using SIL.Extensions;
using SIL.Reporting;

namespace Transcribe.Windows
{
	static class Program
	{
		static TrappingGecko _browser;

		/// <summary>
		/// The main entry point for the application.
		/// </summary>
		[STAThread]
		static void Main(string[] args)
		{
			Application.EnableVisualStyles();
			Application.SetCompatibleTextRenderingDefault(false);
			Xpcom.Initialize("Firefox");
			Util.DataFolder = Path.Combine(Util.DataFolder, Application.CompanyName, Application.ProductName);
			Logger.Init(Path.Combine(Util.DataFolder, Application.ProductVersion, DateTime.Now.ToISO8601TimeFormatWithUTCString().Replace(":", "-")), true);
			Logger.WriteEvent("Launch {0} {1}", Application.ProductName, Application.ProductVersion);
			AddAnySample();
			var randomName = Path.GetTempFileName();
			if (File.Exists(randomName))
				File.Delete(randomName);
			var indexFullName = GetResource.CreateResources(Path.GetFileNameWithoutExtension(randomName));
			Util.Folder = Path.GetDirectoryName(indexFullName);
			GetResource.AddLocalization(Util.Folder);
			var startInfo = new ProcessStartInfo
			{
				FileName = "mono",
				Arguments = $@"SimpleServer.exe 3010 ""{Util.Folder}""",
				WindowStyle = ProcessWindowStyle.Hidden,
				RedirectStandardOutput = true,
				UseShellExecute = false
			};
			using (var reactProcess = new Process {StartInfo = startInfo})
			{
				reactProcess.Start();
				var f = new Form { Size = new Size(1250, 722), MinimumSize = new Size(1055, 270)};
				_browser = new TrappingGecko { Dock = DockStyle.Fill, UseHttpActivityObserver = true};
				f.Text = $"{Application.ProductName}  {Application.ProductVersion}";
				f.Controls.Add(_browser);
				var portAddr = GetPortAddr(reactProcess);
				_browser.Navigate($"http://localhost:{portAddr}");
				Application.Run(f);
				reactProcess.Kill();
				reactProcess.WaitForExit();
			}

			var apiFolder = Path.Combine(Util.Folder, "api");
			if (Directory.Exists(apiFolder))
				Directory.Delete(apiFolder, true);	// remove all api related files
			foreach (var fullPath in Util.SupportFile)
			{
				File.Delete(fullPath);
				Util.DeleteFolder(fullPath);
			}
		}

		private static void AddAnySample()
		{
			var folderInfo = new DirectoryInfo(Util.DataFolder);
			if (folderInfo.Exists && folderInfo.GetFiles("tasks.xml").Length > 0)
				return; // Data exists
			var appFolder = Assembly.GetExecutingAssembly().Location;
			appFolder = Path.GetDirectoryName(appFolder);
			var sampleInfo = new DirectoryInfo(appFolder).GetDirectories("Sample");
			if (sampleInfo.Length == 0)
				return; // No Sample data
			CopySampleFolder(sampleInfo[0], folderInfo);
		}

		private static void CopySampleFolder(DirectoryInfo sampleInfo, DirectoryInfo folderInfo)
		{
			folderInfo.Create();
			foreach (var folder in sampleInfo.GetDirectories())
			{
				folderInfo.CreateSubdirectory(folder.Name);
				CopySampleFolder(folder, new DirectoryInfo(Path.Combine(folderInfo.FullName, folder.Name)));
			}

			foreach (var fileInfo in sampleInfo.GetFiles())
			{
				File.Copy(fileInfo.FullName, Path.Combine(folderInfo.FullName, fileInfo.Name), true);
			}
		}

		private static string GetPortAddr(Process p)
		{
			var task = p.StandardOutput.ReadLineAsync();
			while (!task.IsCompleted)
				Thread.Sleep(50);
			var portAddr = task.Result.Substring(13); // Result will be: "Listening to xxxx"
			return portAddr.Length == 4 ? portAddr : "3010";
		}

	}
}
