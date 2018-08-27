using System;
using System.IO;
using NUnit.Framework;

namespace Transcribe.Windows.Tests
{
	[TestFixture]
	public class TrappingGeckoTests
	{
		#region Private Variables

		private string _inputPath;
		private string _outputPath;
		private string _expectedPath;
		private string _expectedlinuxPath;

		#endregion Private Variables

		[Obsolete]
		protected void SetUp()
		{
			string testPath = Common.Bin(AppDomain.CurrentDomain.BaseDirectory, "TestFiles");
			_inputPath = Common.PathCombine(testPath, "input");
			_outputPath = Common.PathCombine(testPath, "output");
			_expectedPath = Common.PathCombine(testPath, "expected");
			_expectedlinuxPath = Common.PathCombine(testPath, "expectedlinux");
			Common.DeleteDirectory(_outputPath);
			Directory.CreateDirectory(_outputPath);
		}

		[Test]
		public void VerseNumberAtStart()
		{
			//string fileName = Common.PathCombine(_inputPath, "aai-LUK-001-001004.mp3");
			string fileName = "aai-LUK-001-001004.mp3";
			string eafFilePath = Common.PathCombine(_inputPath,
				Common.PathCombine(Path.GetDirectoryName(fileName), Path.GetFileNameWithoutExtension(fileName) + ".eaf"));
			TrappingGecko.UploadToParatext(fileName, eafFilePath);
		}
	}
}
