using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Newtonsoft.Json;

namespace ReactShared
{
	public class GetDefaultUserHotKeys
	{

		public GetDefaultUserHotKeys()
		{
			var apiFolder = Util.ApiFolder();
			var hotKeysList = new List<string>();
			hotKeysList.Add("{\"id\": \"play-pause\", \"text\": \"esc\"}");
			hotKeysList.Add("{\"id\": \"back\", \"text\": \"f2\"}");
			hotKeysList.Add("{\"id\": \"forward\", \"text\": \"f3\"}");
			hotKeysList.Add("{\"id\": \"slower\", \"text\": \"f4\"}");
			hotKeysList.Add("{\"id\": \"faster\", \"text\": \"f5\"}");

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetDefaultUserHotkeys")))
			{
				sw.Write($"[{string.Join(",", hotKeysList)}]");
			}
		}
	}
}
