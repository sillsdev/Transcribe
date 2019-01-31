using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using ReactShared;

namespace Transcribe.Test
{
	public class GetDefaultUserHotKeysTest
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
		public void CheckDefaultUserHotKeysTest()
		{
			Util.Testing = true;
			Util.TestingOutputDirectory = _outputPath;
			new GetDefaultUserHotKeys();
			FileAssert.AreEqual(Path.Combine(_outputPath, "GetDefaultUserHotkeys"),Path.Combine(_expectedPath, "GetDefaultUserHotkeys"));
			Util.TestingOutputDirectory = string.Empty;
			Util.Testing = false;
		}
	}
}
