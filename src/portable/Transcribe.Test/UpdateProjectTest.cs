using System;
using System.IO;
using NUnit.Framework;
using ReactShared;

namespace Transcribe.Test
{
	[TestFixture]
	public class UpdateProjectTest
	{
		#region Private Variables
		private string _inputPath;
		private string _outputPath;
		private string _expectedPath;
		#endregion Private Variables

		#region Setup
		[SetUp]
		public void SetUp()
		{
			string testPath = Common.Bin(AppDomain.CurrentDomain.BaseDirectory, "TestFiles");
			_inputPath = Common.PathCombine(testPath, "input");
			_outputPath = Common.PathCombine(testPath, "output");
			_expectedPath = Common.PathCombine(testPath, "expected");
			Common.DeleteDirectory(_outputPath);
			Directory.CreateDirectory(_outputPath);
		}
		#endregion

		[Test]
		public void TtpTest()
		{
			Util.DataFolder = _outputPath;
			File.Copy(Path.Combine(_inputPath, "tasksInit.xml"), Path.Combine(_outputPath, "tasks.xml"), true);
			new UpdateProject(
				"project=TTP&name=Transcriber%20Test%20Project&guid=56b5e92a343485542880fd5eda0f0082984b01dc&lang=en&langName=English&font=&size=10&features=&dir=ltr&type=Bible");
			XmlAssert.AreEqual(Path.Combine(_expectedPath, "UpdateProjectTtpTasks.xml"), Path.Combine(_outputPath, "tasks.xml"), "UpdateProject TTP");
		}
	}
}
