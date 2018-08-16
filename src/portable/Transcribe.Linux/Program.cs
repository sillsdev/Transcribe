using System;
using System.Reflection;
using System.Collections.Generic;
using System.Windows.Forms;
using System.Drawing;
using System.IO;
using System.Diagnostics;
using System.Threading;
using System.Xml;
using Gecko;
using Transcribe.Linux.Properties;


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
			Xpcom.Initialize("Firefox-Linux64");
			var randomName = Path.GetTempFileName();
			if (File.Exists(randomName))
				File.Delete(randomName);
			var indexFullName = CreateResources(Path.GetFileNameWithoutExtension(randomName));
			AddLocalization(Path.GetDirectoryName(indexFullName));
			var startInfo = new ProcessStartInfo
			{
				FileName = "mono",
				Arguments = $@"SimpleServer.exe 3010 ""{Path.GetDirectoryName(indexFullName)}""",
				WindowStyle = ProcessWindowStyle.Hidden,
				RedirectStandardOutput = true,
				UseShellExecute = false
			};
			using (var reactProcess = new Process { StartInfo = startInfo })
			{
				reactProcess.Start();
				var f = new Form { Size = new Size(1055, 800), MinimumSize = new Size(1055, 270) };
				_browser = new TrappingGecko { Folder = Path.GetDirectoryName(indexFullName), Dock = DockStyle.Fill, UseHttpActivityObserver = true };
				f.Text = $"{Application.ProductName}  {Application.ProductVersion}";
				f.Controls.Add(_browser);
				var portAddr = GetPortAddr(reactProcess);
				_browser.Navigate($"http://localhost:{portAddr}");
				Application.Run(f);
				reactProcess.Kill();
				reactProcess.WaitForExit();
			}

			var apiFolder = Path.Combine(Path.GetDirectoryName(indexFullName), "api");
			if (Directory.Exists(apiFolder))
				Directory.Delete(apiFolder, true);  // remove all api related files
			foreach (var fullPath in SupportFile)
			{
				File.Delete(fullPath);
				DeleteFolder(fullPath);
			}
		}

		private static void AddLocalization(string siteFolder)
		{
			const string name = "strings.json";
			const string localizationTag = "localization";
			var srcBaseFolder = DataFolder();
			Debug.Assert(srcBaseFolder != null, nameof(srcBaseFolder) + " != null");
			var srcFullName = Path.Combine(srcBaseFolder, localizationTag, name);
			if (!File.Exists(srcFullName))
			{
				const string resourceBase = "ReactShared.data.";
				var portableName = new DirectoryInfo(".").GetFiles("ReactShared.dll")[0].FullName;
				var assembly = SharedAssembly(portableName);
				WriteResource(resourceBase, srcBaseFolder, assembly, localizationTag, name);
			}

			var siteLocalizationFolder = Path.Combine(siteFolder, localizationTag);
			if (!Directory.Exists(siteLocalizationFolder))
			{
				Directory.CreateDirectory(siteLocalizationFolder);
			}

			var fullPath = Path.Combine(siteLocalizationFolder, name);
			File.Copy(srcFullName, fullPath, true);
			SupportFile.Add(fullPath);
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
			const string resourceBase =  "ReactShared.react.build.";
			var folder = Path.Combine(Path.GetTempPath(), randomName);
			if (!Directory.Exists(folder))
				Directory.CreateDirectory(folder);
			var portableName = new DirectoryInfo(".").GetFiles("ReactShared.dll")[0].FullName;
			var assembly = SharedAssembly(portableName);
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
						WriteResource(resourceBase, folder, assembly, $"{nameParts[3]}/{nameParts[4]}", string.Join(".", nameParts, 5, nameParts.Length - 5));
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
			const string resourceBase = "ReactShared.data.";
			var portableName = new DirectoryInfo(".").GetFiles("ReactShared.dll")[0].FullName;
			var assembly = SharedAssembly(portableName);
			var folder = DataFolder();
			var initFile = Path.Combine(folder, dataset + "Init.xml");
			if (File.Exists(initFile))
				File.Delete(initFile);
			WriteResource(resourceBase, folder, assembly, "", dataset + "Init.xml");
			WriteResource(resourceBase, folder, assembly, "", dataset + ".xsd");
			File.Copy(initFile, Path.Combine(folder, dataset + ".xml"));
			File.Delete(initFile);
		}

		public static XmlDocument XmlTemplate(string name)
		{
			const string resourceBase = "ReactShared.data.";
			var portableName = new DirectoryInfo(".").GetFiles("ReactShared.dll")[0].FullName;
			var assembly = SharedAssembly(portableName);
			var xml = new XmlDocument();
			using (var str = new StreamReader(assembly.GetManifestResourceStream(resourceBase + name)))
			{
				xml.Load(str);
			}

			return xml;
		}

		private static string WriteResource(string resourceBase, string folder, Assembly assembly, string projectLocation, string name)
		{
			var resourceLocation = resourceBase;
			if (!string.IsNullOrEmpty(projectLocation))
				resourceLocation += projectLocation.Replace("/", ".") + ".";
			string fullPath;
			using (var str = new StreamReader(assembly.GetManifestResourceStream(resourceLocation + name)))
			{
				var myFolder = string.IsNullOrEmpty(projectLocation) ? folder : Path.Combine(folder, projectLocation);
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

		public static string DataFolder()
		{
            var fileVersionInfo = FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location);
            var folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), fileVersionInfo.CompanyName, fileVersionInfo.ProductName);
			return folder;
		}

		private static Assembly SharedAssembly(string fullName)
		{
			return Assembly.LoadFile(fullName);
			//return AssemblyLoadContext.Default.LoadFromAssemblyPath(fullName);
		}
	}
}
