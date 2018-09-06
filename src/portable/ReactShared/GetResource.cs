using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Xml;

namespace ReactShared
{
	public class GetResource
	{
		public static void AddLocalization(string siteFolder)
		{
			const string name = "strings.json";
			const string localizationTag = "localization";
			var srcBaseFolder = Util.DataFolder;
			Debug.Assert(srcBaseFolder != null, nameof(srcBaseFolder) + " != null");
			var srcFullName = Path.Combine(srcBaseFolder, localizationTag, name);
			//if (!File.Exists(srcFullName))
			//{
			const string resourceBase = "ReactShared.data.";
			var portableName = new DirectoryInfo(".").GetFiles("ReactShared.dll")[0].FullName;
			var assembly = Assembly.LoadFile(portableName);
			WriteResource(resourceBase, srcBaseFolder, assembly, localizationTag, name);
			//}

			var siteLocalizationFolder = Path.Combine(siteFolder, localizationTag);
			if (!Directory.Exists(siteLocalizationFolder))
			{
				Directory.CreateDirectory(siteLocalizationFolder);
			}

			var fullPath = Path.Combine(siteLocalizationFolder, name);
			File.Copy(srcFullName, fullPath, true);
			Util.SupportFile.Add(fullPath);
		}

		public static string CreateResources(string randomName)
		{
			const string resourceBase = "ReactShared.react.build.";
			var folder = Path.Combine(Path.GetTempPath(), randomName);
			if (!Directory.Exists(folder))
				Directory.CreateDirectory(folder);
			var portableName = new DirectoryInfo(".").GetFiles("ReactShared.dll")[0].FullName;
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
			var assembly = Assembly.LoadFile(portableName);
			var folder = Util.DataFolder;
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
			var assembly = Assembly.LoadFile(portableName);
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
				Util.SupportFile.Add(fullPath);
			}

			return fullPath;
		}
	}
}
