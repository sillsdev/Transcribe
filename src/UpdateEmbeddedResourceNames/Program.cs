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
			if (args.Length != 2) throw new ArgumentException("Usage: UpdateEmbeddedResourceNames folder fullName.csproj");
			var folder = args[0];
			var csproj = args[1];

			var csprojDoc = new XmlDocument();
			using (var xr = XmlReader.Create(csproj))
			{
				csprojDoc.Load(xr);
			}

			if (csprojDoc.SelectSingleNode("//*[local-name() = 'None' and count(@Remove) != 0]") != null)
			{ // .net Core
				DeleteNodes(csprojDoc, "//*[local-name() = 'None' and starts-with(@Remove,'react')]");
				DeleteNodes(csprojDoc, "//*[local-name() = 'EmbeddedResource' and starts-with(@Include,'react')]");
				InsertReactNodes(csprojDoc, folder, "None", "Remove");
				InsertReactNodes(csprojDoc, folder, "EmbeddedResource", "Include");
			}
			else
			{ // .net Framework
				DeleteNodes(csprojDoc, "//*[local-name() = 'ItemGroup' and local-name(*) = 'EmbeddedResource' and starts-with(*/@Include, 'react')]");
				InsertItemgroup(csprojDoc, folder);
			}

			using (var xw = XmlWriter.Create(csproj, new XmlWriterSettings { Indent = true }))
			{
				csprojDoc.Save(xw);
			}
		}

		private static void DeleteNodes(XmlDocument csprojDoc, string xpath)
		{
			var oldNodes = csprojDoc.SelectNodes(xpath);
			Debug.Assert(oldNodes != null, nameof(oldNodes) + " != null");
			foreach (XmlElement oldNode in oldNodes)
			{
				Debug.Assert(oldNode.ParentNode != null, "oldNode.ParentNode != null");
				oldNode.ParentNode.RemoveChild(oldNode);
			}
		}

		private static void InsertReactNodes(XmlDocument csprojDoc, string folder, string elem, string attr)
		{
			var itemGroupNode = csprojDoc.SelectSingleNode($@"//*[local-name() = 'ItemGroup' and count(*/@{attr}) != 0]");
			InsertFolder(folder, itemGroupNode, @"react\build", elem, attr);
		}

		private static void InsertItemgroup(XmlDocument csprojDoc, string folder)
		{
			var itemGroupNode = csprojDoc.CreateElement("ItemGroup", csprojDoc.DocumentElement.NamespaceURI);
			InsertFolder(folder, itemGroupNode, @"react\build", "EmbeddedResource", "Include");
			var locationNode = csprojDoc.SelectSingleNode("//*[contains(*/@Include,'AssemblyInfo')]");
			csprojDoc.DocumentElement.InsertAfter(itemGroupNode, locationNode);
		}

		private static void InsertFolder(string folder, XmlNode itemGroupNode, string prefix, string elem, string attr)
		{
			var dirInfo = new DirectoryInfo(folder);
			var owner = itemGroupNode.OwnerDocument;
			Debug.Assert(owner != null, nameof(owner) + " != null");
			foreach (var fileInfo in dirInfo.GetFiles())
			{
				var embeddedResourceNode = owner.CreateElement(elem, owner.DocumentElement.NamespaceURI);
				var includeAttr = owner.CreateAttribute(attr);
				includeAttr.InnerXml = $@"{prefix}\{fileInfo.Name}";
				embeddedResourceNode.Attributes.Append(includeAttr);
				itemGroupNode.AppendChild(embeddedResourceNode);
			}

			foreach (var directoryInfo in dirInfo.GetDirectories())
			{
				var newPrefix = $@"{prefix}\{directoryInfo.Name}";
				InsertFolder(directoryInfo.FullName, itemGroupNode, newPrefix, elem, attr);
			}
		}
	}
}
