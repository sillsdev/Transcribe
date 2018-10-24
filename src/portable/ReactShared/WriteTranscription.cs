using System;
using System.Diagnostics;
using System.IO;
using System.Web;
using System.Xml;
using Newtonsoft.Json;

namespace ReactShared
{
	public class WriteTranscription
	{
		public WriteTranscription(string query, byte[] requestBody)
		{
			var writeToEafDone = false;
			var apiFolder = Util.ApiFolder();
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var taskid = parsedQuery["task"];
			var length = parsedQuery["length"];
			var lang = parsedQuery["lang"];
			var dir = parsedQuery["dir"];
			var transcription = Util.GetRequestElement(requestBody, "text");
			var xml = GetResource.XmlTemplate("transcription.eaf");
			UpdateXml(xml, "@DATE", DateTime.UtcNow.ToLocalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffzzz"));
			UpdateXml(xml, "*[local-name()='ANNOTATION_VALUE']", transcription);
			UpdateXml(xml, "@DEFAULT_LOCALE", lang);
			UpdateXml(xml, "@LANGUAGE_CODE", lang);
			var miliseconds = float.Parse(length) * 1000.0;
			var duration = miliseconds.ToString("F0");
			UpdateXml(xml, "*[@TIME_SLOT_ID='ts2']/@TIME_VALUE", duration);

			var folder = Util.FileFolder(taskid);
			var name = taskid;
			var ext = Path.GetExtension(name);
			UpdateXml(xml, "@MEDIA_FILE", name);
			UpdateXml(xml, "@MEDIA_URL", name);
			UpdateXml(xml, "@MIME_TYPE", ext == ".mp3" ? "audio/x-mp3" : "audio/x-wav");
			var outName = Path.Combine(folder, Path.GetFileNameWithoutExtension(name) + ".eaf");
			using (var xw = XmlWriter.Create(outName, new XmlWriterSettings { Indent = true }))
			{
				try
				{
					xml.Save(xw);
					writeToEafDone = true;
				}
				catch
				{
					writeToEafDone = false;
				}
			}

			if (writeToEafDone)
			{
				var transcriptionDoc = new XmlDocument();
				transcriptionDoc.LoadXml("<root/>");
				Util.NewAttr(transcriptionDoc.DocumentElement, "position", duration);
				Util.NewChild(transcriptionDoc.DocumentElement, "transcription", transcription);

				var transcriptionJson =
					JsonConvert.SerializeXmlNode(transcriptionDoc.DocumentElement).Replace("\"@", "\"").Substring(8);
				using (var sw =
					new StreamWriter(Path.Combine(apiFolder, "audio", Path.GetFileNameWithoutExtension(name) + ".transcription")))
				{
					sw.Write(transcriptionJson.Substring(0, transcriptionJson.Length - 1));
				}
			}
		}

		private void UpdateXml(XmlNode xml, string path, string val)
		{
			var node = xml.SelectSingleNode($@"//{path}");
			if (node != null)
			{
				node.InnerText = val;
			}
			else
			{
				Debug.Print("Missing xml path: " + path);
			}
		}

	}
}
