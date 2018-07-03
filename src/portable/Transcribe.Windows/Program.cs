using System;
using System.Reflection;
using System.Collections.Generic;
using System.Windows.Forms;
using System.Drawing;
using System.IO;
using System.Diagnostics;
using System.Threading;
using Gecko;


namespace Transcribe.Windows
{
	static class Program
	{
		private static readonly List<String> SupportFile = new List<string>();
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
			var indexFullName = CreateResources(Path.GetFileNameWithoutExtension(randomName));
			var startInfo = new ProcessStartInfo
			{
				FileName = "SimpleServer.exe",
				Arguments = $@"3010 ""{Path.GetDirectoryName(indexFullName)}""",
				WindowStyle = ProcessWindowStyle.Hidden,
				RedirectStandardOutput = true,
				UseShellExecute = false
			};
			using (var reactProcess = new Process {StartInfo = startInfo})
			{
				reactProcess.Start();
				var f = new Form { Size = new Size(800, 800) };
				_browser = new TrappingGecko { Folder = Path.GetDirectoryName(indexFullName), Dock = DockStyle.Fill, UseHttpActivityObserver = true};
				f.Controls.Add(_browser);
				var portAddr = GetPortAddr(reactProcess);
				_browser.Navigate($"http://localhost:{portAddr}");
				Application.Run(f);
				reactProcess.Kill();
				reactProcess.WaitForExit();
			}

			var apiFolder = Path.Combine(Path.GetDirectoryName(indexFullName), "api");
			if (Directory.Exists(apiFolder))
				Directory.Delete(apiFolder, true);	// remove all api related files
			foreach (var fullPath in SupportFile)
			{
				File.Delete(fullPath);
				DeleteFolder(fullPath);
			}
		}

		private static void DeleteFolder(string fullPath)
		{
			var folder = Path.GetDirectoryName(fullPath);
			try
			{
				Directory.Delete(folder);
				DeleteFolder(folder);
			}
			catch
			{
				// if not empty, ignore delete directory
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

		private static string CreateResources(string randomName)
		{
			const string resourceBase = "ReactUi.react.build.";
			var folder = Path.Combine(Path.GetTempPath(), randomName);
			if (!Directory.Exists(folder))
				Directory.CreateDirectory(folder);
			var portableName = new DirectoryInfo(".").GetFiles("ReactUi.dll")[0].FullName;
			var assembly = Assembly.LoadFile(portableName);
			const string assetsTag = "assets";
			const string staticTag = "static";
			foreach (var resourceName in assembly.GetManifestResourceNames())
			{
				var nameParts = resourceName.Split('.');
				if (nameParts[1] != "react")
					continue;
				switch (nameParts[3])
				{
					case assetsTag:
						WriteResource(resourceBase, folder, assembly, assetsTag, string.Join(".", nameParts, 4, nameParts.Length - 4));
						break;
					case staticTag:
						WriteResource(resourceBase, folder, assembly, $"{staticTag}/{nameParts[4]}", string.Join(".", nameParts, 5, nameParts.Length - 5));
						break;
					case "index":
						break;
					default:
						WriteResource(resourceBase, folder, assembly, "", string.Join(".", nameParts, 3, nameParts.Length - 3));
						break;
				}
			}
			return WriteResource(resourceBase, folder, assembly, "", "index.html");
		}

		public static void DefaultData(string dataset)
		{
			const string resourceBase = "ReactUi.data.";
			var portableName = new DirectoryInfo(".").GetFiles("ReactUi.dll")[0].FullName;
			var assembly = Assembly.LoadFile(portableName);
			var folder = Application.CommonAppDataPath;
			var initFile = Path.Combine(folder, dataset + "Init.xml");
			if (File.Exists(initFile))
				File.Delete(initFile);
			WriteResource(resourceBase, folder, assembly, "", dataset + "Init.xml");
			WriteResource(resourceBase, folder, assembly, "", dataset + ".xsd");
			File.Copy(initFile, Path.Combine(folder, dataset + ".xml"));
			File.Delete(initFile);
		}


		private static string WriteResource(string resourceBase, string folder, Assembly assembly, string projectLocation, string name)
		{
			var resourceLocation = resourceBase;
			if (!string.IsNullOrEmpty(projectLocation))
				resourceLocation += projectLocation.Replace("/",".") + ".";
			string  fullPath;
			using (var str = new StreamReader(assembly.GetManifestResourceStream(resourceLocation + name)))
			{
				var myFolder = string.IsNullOrEmpty(projectLocation)? folder : Path.Combine(folder, projectLocation);
				if (!Directory.Exists(myFolder)) Directory.CreateDirectory(myFolder);
				fullPath = Path.Combine(myFolder, name);
				var buffer = new byte[1000];
				using (var os = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
				{
					int count;
					do
					{
						count = str.BaseStream.Read(buffer, 0, 1000);
						os.Write(buffer, 0, count);
					} while (count > 0);
				}
				SupportFile.Add(fullPath);
			}

			return fullPath;
		}

	}
}
