using System.Collections.Generic;
using Newtonsoft.Json;

namespace ReactShared
{
	public class Project
	{
		public string id { get; set; }
		public string name { get; set; }
		public string guid { get; set; }
		public string lang { get; set; }
		public string langName { get; set; }
		public string font { get; set; }
		public string size { get; set; }
		public string features { get; set; }
		public string direction { get; set; }
		public string sync { get; set; }
		public string claim { get; set; }
		public string type { get; set; }
		public string uri { get; set; }
		public List<TaskJson> task { get; set; }
	}
}
