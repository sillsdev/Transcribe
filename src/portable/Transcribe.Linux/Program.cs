using System;
using System.Windows.Forms;
using System.Drawing;
using System.IO;
using System.Diagnostics;
using System.Threading;
using Gecko;
using ReactShared;
using Transcribe.Linux.Properties;

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
				var f = new Form { Size = new Size(1055, 800), MinimumSize = new Size(1055, 270)};
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
