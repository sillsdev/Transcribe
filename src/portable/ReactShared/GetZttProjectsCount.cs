using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Web;
using System.Xml;
using Newtonsoft.Json;

namespace ReactShared
{
	public class GetZttProjectsCount
	{
		public GetZttProjectsCount()
		{
			var apiFolder = Util.ApiFolder();
			var tasksDoc = Util.LoadXmlData("tasks");
			var projectCount = "0";

			var projectNode = tasksDoc.SelectNodes($"//project[@id[starts-with(.,'ztt')]]");
			if (projectNode != null)
			{
				projectCount = projectNode.Count.ToString();
			}

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetZttProjectsCount")))
			{
				sw.Write($"[{projectCount}]".Replace("{}", ""));
			}
		}
	}
}
