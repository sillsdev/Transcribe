using System;
using System.IO;
using System.Reflection;
using System.Text;
using System.Xml;
using System.Xml.Xsl;
using Newtonsoft.Json;

namespace localization
{
    class Program
    {
		private static readonly XslCompiledTransform MakeStrings = new XslCompiledTransform();
		private static readonly XslCompiledTransform CombineStrings = new XslCompiledTransform();
        static void Main(string[] args)
        {
			// See: https://github.com/dotnet/corefx/issues/31390
			AppContext.SetSwitch("Switch.System.Xml.AllowDefaultResolver", true);
	        MakeStrings.Load(XmlReader.Create(Assembly.GetExecutingAssembly()
		        .GetManifestResourceStream("localization.MakeStrings-12.xsl")));
			var settings = new XsltSettings { EnableDocumentFunction = true };
			CombineStrings.Load(XmlReader.Create(Assembly.GetExecutingAssembly()
		        .GetManifestResourceStream("localization.CombineStrings-12.xsl")), settings, null);
	        var folderIn = "../../..";
	        var relativeDir = "";
	        MakeOneStringsFIle(folderIn, relativeDir, folderIn);
	        var folders = new DirectoryInfo(folderIn).GetDirectories();
			foreach (var directoryInfo in folders)
		        MakeOneStringsFIle(directoryInfo.FullName, "-" + directoryInfo.Name, folderIn);
	        var files = new DirectoryInfo(folderIn).GetFiles("*-1.2.xliff");
	        var currentDirectory = files[0].DirectoryName;
	        if (currentDirectory != null) Environment.CurrentDirectory = currentDirectory;
	        const string stringsFullName = "strings.xml";
	        using (var sw = new StreamWriter(Path.Combine(currentDirectory, stringsFullName), false, new UTF8Encoding(true)))
		        CombineStrings.Transform(files[0].FullName, null, sw);
	        var baseName = Path.GetFileNameWithoutExtension(files[0].Name);
			foreach (var directoryInfo in folders)
		        File.Delete(baseName + "-" + directoryInfo.Name + ".xml");
			File.Delete(baseName + ".xml");
			var strings = new XmlDocument();
			strings.Load(stringsFullName);
	        var json = JsonConvert.SerializeXmlNode(strings.DocumentElement);
	        using (var sw = new StreamWriter("strings.json"))
				sw.Write(json.Substring(11, json.Length - 12));
			File.Delete(stringsFullName);
        }

	    private static void MakeOneStringsFIle(string folderIn, string dir, string folderOut)
	    {
		    foreach (var fileInfo in new DirectoryInfo(folderIn).GetFiles("*-1.2.xliff"))
		    {
			    var name = Path.GetFileNameWithoutExtension(fileInfo.Name) + dir;
			    using (var sw = new StreamWriter(Path.Combine(folderOut, name + ".xml"), false, new UTF8Encoding(true)))
			    {
				    MakeStrings.Transform(fileInfo.FullName, null, sw);
			    }
		    }
	    }
    }
}
