using System.Collections.Generic;
using System.Diagnostics;
using System.Web;
using System.Xml;

namespace ReactShared
{
	public class DeleteUser
	{
		public DeleteUser(string query)
		{
			var parsedQuery = HttpUtility.ParseQueryString(query);
			var user = parsedQuery["user"];
			Debug.Print($"{user}");
			var usersDoc = Util.LoadXmlData("users");
			var userNode = usersDoc.SelectSingleNode($"//user[username/@id = '{user}']");
			if (userNode == null)
				return;

			userNode.ParentNode.RemoveChild(userNode);
			
			using (var xw = XmlWriter.Create(Util.XmlFullName("users"), new XmlWriterSettings { Indent = true }))
			{
				usersDoc.Save(xw);
			}
		}
	}
}
