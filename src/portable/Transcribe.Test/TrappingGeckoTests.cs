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
		private string _inputParatextProjectsPath;

		#endregion Private Variables

		[TestFixtureSetUp]
		protected void SetUp()
		{
			string testPath = Common.Bin(AppDomain.CurrentDomain.BaseDirectory, "TestFiles");
			_inputPath = Common.PathCombine(testPath, "input");
			_inputParatextProjectsPath = Common.PathCombine(testPath, "input\\ParaTextTestProjects");
			_outputPath = Common.PathCombine(testPath, "output");
			_expectedPath = Common.PathCombine(testPath, "expected");
			_expectedlinuxPath = Common.PathCombine(testPath, "expectedlinux");
			Common.DeleteDirectory(_outputPath);
			Directory.CreateDirectory(_outputPath);
		}

		// Case 1
		//==================Paratext==================
		//\v 1 Test Line1
		//\v 2 Test Line2
		//\v 3 Test Line3
		//\v 4 Test Line4
		//===================Transcribe===============
		//\v 1-4 This is sample case with verse number
		//====================Result==================
		//\v 1-4 This is sample case with verse number
		[Test]
		public void VerseNumberAtStart()
		{
			string fileName = "aai-LUK-001-001004.mp3";
			string eafFilePath = Common.PathCombine(_inputPath, "aai-LUK-001-001004.eaf");
			TrappingGecko.UploadToParatext(fileName, eafFilePath, _inputParatextProjectsPath);
			File.Copy(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm", Path.Combine(_outputPath, "43LUKaai.sfm"), true);
			string searchText = "\\v 1-4 This is sample case with verse number";
			string contents = File.ReadAllText(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
			File.Copy((Path.Combine(_inputParatextProjectsPath, "aai-source") + "\\43LUKaai.sfm"), (Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm"), true);
		}

		// Case 2
		//==================Paratext==================
		//\v 23-40 Zechariah ana bowabow Tafaror Bar wanawanan sasawar ufunamaim matabir maiye na ana bar tit.
		//===================Transcribe===============
		//\v 26-38 the test data
		//====================Result==================
		//\v 23-40 Zechariah ana bowabow Tafaror Bar wanawanan sasawar ufunamaim matabir maiye na ana bar tit.
		//\v 26-38 the test data
		[Test]
		public void VerseNumberInMiddle()
		{
			string fileName = "aai-LUK-001-026038v01.mp3";
			string eafFilePath = Common.PathCombine(_inputPath, "aai-LUK-001-026038v01.eaf");
			TrappingGecko.UploadToParatext(fileName, eafFilePath, _inputParatextProjectsPath);
			File.Copy(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm", Path.Combine(_outputPath, "43LUKaai.sfm"), true);
			string searchText = "\\v 23-40 Zechariah ana bowabow Tafaror Bar wanawanan sasawar ufunamaim matabir maiye na ana bar tit.\r\n\\v 26-38 the test data";
			string contents = File.ReadAllText(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
			File.Copy((Path.Combine(_inputParatextProjectsPath, "aai-source") + "\\43LUKaai.sfm"), (Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm"), true);
		}

		// Case 3
		//==================Paratext==================
		//\v \v 39-45 John ef maumurih maiyow sabuw isah binan naatu hai yawas
		//===================Transcribe===============
		//\v 39-45 This is example of replace verse with the existing one
		//====================Result==================
		//\v 39-45 This is example of replace verse with the existing one
		[Test]
		public void VerseNumberReplaceContentOnSameNumber()
		{
			string fileName = "aai-LUK-001-039045v01.mp3";
			string eafFilePath = Common.PathCombine(_inputPath, "aai-LUK-001-039045v01.eaf");
			TrappingGecko.UploadToParatext(fileName, eafFilePath, _inputParatextProjectsPath);
			File.Copy(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm", Path.Combine(_outputPath, "43LUKaai.sfm"), true);
			string searchText = "\\v 39-45 This is example of replace verse with the existing one";
			string contents = File.ReadAllText(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
			File.Copy((Path.Combine(_inputParatextProjectsPath, "aai-source") + "\\43LUKaai.sfm"), (Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm"), true);
		}

		// Case 4
		//==================Paratext==================
		//\v 50-52 This is the text from Paratext SFM Data
		//\v 53 some text
		//===================Transcribe===============
		//\v 50-54 A new text value from eaf file
		//====================Result==================
		//\v 50-52 This is the text from Paratext SFM Data
		//\v 50-54 A new text value from eaf file
		//\v 53 some text
		[Test]
		public void VerseNumberInsertContentWhenNearRangeExists()
		{
			string fileName = "aai-LUK-001-050054v01.mp3";
			string eafFilePath = Common.PathCombine(_inputPath, "aai-LUK-001-050054v01.eaf");
			TrappingGecko.UploadToParatext(fileName, eafFilePath, _inputParatextProjectsPath);
			File.Copy(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm", Path.Combine(_outputPath, "43LUKaai.sfm"), true);
			string searchText = "\\v 50-52 This is the text from Paratext SFM Data\r\n\\v 50-54 A new text value from eaf file\r\n\\v 53 some text\r\n";
			string contents = File.ReadAllText(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
			File.Copy((Path.Combine(_inputParatextProjectsPath, "aai-source") + "\\43LUKaai.sfm"), (Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm"),true);
		}

		// Case 5
		//==================Paratext==================

		//===================Transcribe===============
		//\v 27-28 The text in the EAF File
		//====================Result==================
		//\c 2
		//\v 27-28 The text in the EAF File
		[Test]
		public void VerseNumberInsertContentWhenChapterNotFound()
		{
			string fileName = "aai-LUK-002-027028v01.mp3";
			string eafFilePath = Common.PathCombine(_inputPath, "aai-LUK-002-027028v01.eaf");
			TrappingGecko.UploadToParatext(fileName, eafFilePath, _inputParatextProjectsPath);
			File.Copy(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm", Path.Combine(_outputPath, "43LUKaai.sfm"), true);
			string searchText = "\\c 2\r\n\\v 27-28 The text in the EAF File";
			string contents = File.ReadAllText(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
			File.Copy((Path.Combine(_inputParatextProjectsPath, "aai-source") + "\\43LUKaai.sfm"), (Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm"), true);
		}

		// Case 6
		//==================Paratext==================
		//\v 70-74 marasika ana dinab wanawanahimaim eo’omatanih na’atube.
		//===================Transcribe===============
		//\v 70-72 some text some text some text
		//====================Result==================
		//\v 70-72 some text some text some text
		//\v 70-74 marasika ana dinab wanawanahimaim eo’omatanih na’atube.
		[Test]
		public void VerseNumberInsertContentWhenEndVerseDiffers()
		{
			string fileName = "aai-LUK-001-070072v01.mp3";
			string eafFilePath = Common.PathCombine(_inputPath, "aai-LUK-001-070072v01.eaf");
			TrappingGecko.UploadToParatext(fileName, eafFilePath, _inputParatextProjectsPath);
			File.Copy(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm", Path.Combine(_outputPath, "43LUKaai.sfm"), true);
			string searchText = "\\v 70-72 some text some text some text\r\n\\v 70-74 marasika ana dinab wanawanahimaim eo’omatanih na’atube.";
			string contents = File.ReadAllText(Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm");
			int indexPosition = contents.IndexOf(searchText, StringComparison.Ordinal);
			Assert.AreNotEqual(indexPosition, -1);
			File.Copy((Path.Combine(_inputParatextProjectsPath, "aai-source") + "\\43LUKaai.sfm"), (Path.Combine(_inputParatextProjectsPath, "aai") + "\\43LUKaai.sfm"), true);
		}
	}
}
