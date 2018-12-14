using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class GetMeta
	{
		public GetMeta(string query, byte[] requestBody)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var fileName = parsedQuery["fileName"];
			string audioData = Util.GetRequestElement(requestBody, "data");
			var apiFolder = Util.ApiFolder();
			const string tempAudio = "temp.mp3";
			var tempFullName = Path.Combine(apiFolder, tempAudio);
			Util.SaveByteData(audioData, tempFullName);
			var exeFolder = Assembly.GetExecutingAssembly().Location;
			var result = new XmlDocument();
			using (var p = new Process())
			{
				p.StartInfo = new ProcessStartInfo
				{
					Arguments = $"-fast -Duration -n -X {tempFullName}",
					FileName = Path.Combine(Path.GetDirectoryName(exeFolder), "exiftool.exe"),
					RedirectStandardOutput = true,
					RedirectStandardError = true,
					StandardOutputEncoding = Encoding.UTF8,
					UseShellExecute = false,
					CreateNoWindow = true,
					WindowStyle = ProcessWindowStyle.Hidden,
				};
				p.Start();
				p.WaitForExit();
				result.LoadXml(p.StandardOutput.ReadToEnd());
			}
			var duration = result.SelectSingleNode("//*[local-name()='Duration']")?.InnerText;
			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetMeta")))
			{
				sw.Write($"{{\"size\": {duration}, \"waveform\": \"\" }}");
			}
		}

	}
}
