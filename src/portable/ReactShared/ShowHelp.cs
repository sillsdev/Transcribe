using System.Web;

namespace ReactShared
{
	public class ShowHelp
	{
		public delegate void ShowHelpTopic(string topic, string helpFileName);

		public ShowHelp(string query, ShowHelpTopic showHelp)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var topic = parsedQuery["topic"];
			// The filepath needs to be changed in the line below
			var chmFileName = "Transcriber_Helps.chm";
			showHelp(topic, chmFileName);
		}
	}
}
