using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;
using System.Xml;

namespace UpdateEmbeddedResourceNames
{
	static class Program
	{
		/// <summary>
		/// The main entry point for the application.
		/// </summary>
		[STAThread]
		static void Main(string[] args)
		{
			Application.EnableVisualStyles();
			Application.SetCompatibleTextRenderingDefault(false);
			if (args.Length != 2) throw new ArgumentException("Usage: UpdateEmbeddedResourceNames folder fullName.csproj");
			var folder = args[0];
			var csproj = args[1];
			var csprojDoc = new XmlDocument();
			using (var xr = XmlReader.Create(csproj))
			{
				csprojDoc.Load(xr);
			}

			var oldNodes = csprojDoc.SelectNodes("//*[local-name() = 'ItemGroup' and local-name(*) = 'EmbeddedResource' and starts-with(*/@Include, 'react')]");
			Debug.Assert(oldNodes != null, nameof(oldNodes) + " != null");
			foreach (XmlElement oldNode in oldNodes)
			{
				Debug.Assert(oldNode.ParentNode != null, "oldNode.ParentNode != null");
				oldNode.ParentNode.RemoveChild(oldNode);
			}

			var itemGroupNode = csprojDoc.CreateElement("ItemGroup", csprojDoc.DocumentElement.NamespaceURI);
			InsertFolder(folder, itemGroupNode, @"react\build");
			var locationNode = csprojDoc.SelectSingleNode("//*[contains(*/@Include,'AssemblyInfo')]");
			csprojDoc.DocumentElement.InsertAfter(itemGroupNode, locationNode);
			using (var xw = XmlWriter.Create(csproj, new XmlWriterSettings{Indent = true}))
			{
				csprojDoc.Save(xw);
			}
		}

		private static void InsertFolder(string folder, XmlNode itemGroupNode, string prefix)
		{
			var dirInfo = new DirectoryInfo(folder);
			var owner = itemGroupNode.OwnerDocument;
			Debug.Assert(owner != null, nameof(owner) + " != null");
			foreach (var fileInfo in dirInfo.GetFiles())
			{
				var embeddedResourceNode = owner.CreateElement("EmbeddedResource", owner.DocumentElement.NamespaceURI);
				var includeAttr = owner.CreateAttribute("Include");
				includeAttr.InnerXml = $@"{prefix}\{fileInfo.Name}";
				embeddedResourceNode.Attributes.Append(includeAttr);
				itemGroupNode.AppendChild(embeddedResourceNode);
			}

			foreach (var directoryInfo in dirInfo.GetDirectories())
			{
				var newPrefix = $@"{prefix}\{directoryInfo.Name}";
				InsertFolder(directoryInfo.FullName, itemGroupNode, newPrefix);
			}
		}
	}
}
