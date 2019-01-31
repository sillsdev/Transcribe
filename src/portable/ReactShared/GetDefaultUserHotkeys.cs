using System;
using System.Collections.Generic;
using System.IO;

namespace ReactShared
{
	public class GetDefaultUserHotKeys : IDisposable
	{
		public GetDefaultUserHotKeys()
		{
			var apiFolder = Util.Testing? Util.TestingOutputDirectory : Util.ApiFolder();
			var hotKeysList = new List<string>
			{
				@"{""id"": ""play-pause"", ""text"": ""esc""}",
				@"{""id"": ""back"", ""text"": ""f2""}",
				@"{""id"": ""forward"", ""text"": ""f3""}",
				@"{""id"": ""slower"", ""text"": ""f4""}",
				@"{""id"": ""faster"", ""text"": ""f5""}"
			};

			using (var sw = new StreamWriter(Path.Combine(apiFolder, "GetDefaultUserHotkeys")))
			{
				sw.Write($"[{string.Join(",", hotKeysList)}]");
			}
		}

		public void Dispose() // The api folder and its contents are removed when the program closes
		{
		}
	}
}
