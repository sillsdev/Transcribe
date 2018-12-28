using System.Collections.Generic;
using Newtonsoft.Json;

namespace ReactShared
{
	public class TaskJson
	{
		public string id { get; set; }
		[JsonIgnore]
		public string newId { get; set; }
		public string length { get; set; }
		public string state { get; set; }
		public string position { get; set; }
		public string assignedto { get; set; }
		public string name { get; set; }
		public List<TaskHistory> history { get; set; }
	}
}