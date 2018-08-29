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

		[TestFixtureSetUp]
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
			string fileName = "aai-LUK-001-001004.mp3";
			string eafFilePath = Common.PathCombine(_inputPath,
				Common.PathCombine(Path.GetDirectoryName(fileName), Path.GetFileNameWithoutExtension(fileName) + ".eaf"));
			TrappingGecko.UploadToParatext(fileName, eafFilePath, "\\43LUKaai1.sfm");
			string searchText = "\\v 1-4 This is sample case with verse number";
			string contents = File.ReadAllText(_outputPath + "\\43LUKaai1.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
		}

		[Test]
		public void VerseNumberInMiddle()
		{
			string fileName = "aai-LUK-001-026038v01.mp3";
			string eafFilePath = Common.PathCombine(_inputPath,
				Common.PathCombine(Path.GetDirectoryName(fileName), Path.GetFileNameWithoutExtension(fileName) + ".eaf"));
			TrappingGecko.UploadToParatext(fileName, eafFilePath, "\\43LUKaai2.sfm");
			string searchText = "\\v 23-40 Zechariah ana bowabow Tafaror Bar wanawanan sasawar ufunamaim matabir maiye na ana bar tit.\r\n\\v 26-38 thetestdata stherealstate fthematter sthegameoftoday theday kkkk nkbottle jjjjj mn fdgfd testofthetranscription";
			string contents = File.ReadAllText(_outputPath + "\\43LUKaai2.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
		}

		[Test]
		public void VerseNumberReplaceContentOnSameNumber()
		{
			string fileName = "aai-LUK-001-039045v01.mp3";
			string eafFilePath = Common.PathCombine(_inputPath,
				Common.PathCombine(Path.GetDirectoryName(fileName), Path.GetFileNameWithoutExtension(fileName) + ".eaf"));
			TrappingGecko.UploadToParatext(fileName, eafFilePath, "\\43LUKaai2.sfm");
			string searchText = "\\v 39-45 This is example of replace verse with the existing one";
			string contents = File.ReadAllText(_outputPath + "\\43LUKaai2.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
		}
	}
}
