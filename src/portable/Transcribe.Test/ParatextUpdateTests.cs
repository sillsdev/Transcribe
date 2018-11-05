using System;
using System.IO;
using System.Text;
using NUnit.Framework;
using ReactShared;

namespace Transcribe.Test
{
	[TestFixture]
	public class ParatextUpdateTests : ParatextUpdate
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
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 1;
			currentTask.VerseEnd = 4;
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberAtStart.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberAtStart.sfm");
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "WithParatextData.sfm"));
			string transcription = "This is sample case with verse number";
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription);
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 2
		////==================Paratext==================
		////\v 23-40 Zechariah ana bowabow Tafaror Bar wanawanan sasawar ufunamaim matabir maiye na ana bar tit.
		////===================Transcribe===============
		////\v 26-38 the test data
		////====================Result==================
		////\v 23-40 Zechariah ana bowabow Tafaror Bar wanawanan sasawar ufunamaim matabir maiye na ana bar tit.
		////\v 26-38 the test data
		[Test]
		public void VerseNumberInMiddle()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 26;
			currentTask.VerseEnd = 38;
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInMiddle.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInMiddle.sfm");
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "WithParatextData.sfm"));
			string transcription = "the test data";
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription);
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 3
		////==================Paratext==================
		////\v \v 39-45 John ef maumurih maiyow sabuw isah binan naatu hai yawas
		////===================Transcribe===============
		////\v 39-45 This is example of replace verse with the existing one
		////====================Result==================
		////\v 39-45 This is example of replace verse with the existing one
		[Test]
		public void VerseNumberReplaceContentOnSameNumber()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 39;
			currentTask.VerseEnd = 45;
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "WithParatextData.sfm"));
			string transcription = "This is example of replace verse with the existing one";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberReplaceContentOnSameNumber.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberReplaceContentOnSameNumber.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription);
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath,	expectedFilePath);
		}

		//// Case 4
		////==================Paratext==================
		////\v 50-52 This is the text from Paratext SFM Data
		////\v 53 some text
		////===================Transcribe===============
		////\v 50-54 A new text value from eaf file
		////====================Result==================
		////\v 50-52 This is the text from Paratext SFM Data
		////\v 50-54 A new text value from eaf file
		////\v 53 some text
		[Test]
		public void VerseNumberInsertContentWhenNearRangeExists()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 50;
			currentTask.VerseEnd = 54;
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "WithParatextData.sfm"));
			string transcription = "A new text value from eaf file";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInsertContentWhenNearRangeExists.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInsertContentWhenNearRangeExists.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription);
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 5
		////==================Paratext==================

		////===================Transcribe===============
		////\v 27-28 The text in the EAF File
		////====================Result==================
		////\c 2
		////\v 27-28 The text in the EAF File
		[Test]
		public void VerseNumberInsertContentWhenChapterNotFound()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 2;
			currentTask.VerseStart = 27;
			currentTask.VerseEnd = 28;
			string chapterContent = "";
			string transcription = "The text in the EAF File";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInsertContentWhenChapterNotFound.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInsertContentWhenChapterNotFound.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription);
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 6
		////==================Paratext==================
		////\v 70-74 marasika ana dinab wanawanahimaim eo omatanih na atube.
		////===================Transcribe===============
		////\v 70-72 some text some text some text
		////====================Result==================
		////\v 70-72 some text some text some text
		////\v 70-74 marasika ana dinab wanawanahimaim eo omatanih na atube.
		[Test]
		public void VerseNumberInsertContentWhenEndVerseDiffers()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 70;
			currentTask.VerseEnd = 72;
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "WithParatextData.sfm"));
			string transcription = "some text some text some text";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInsertContentWhenEndVerseDiffers.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInsertContentWhenEndVerseDiffers.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription);
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 7
		//==================Paratext==================
		//\c 1
		//\v 1
		//\v 2
		//\v 3
		//\v 4
		//===================Transcribe===============
		//\v 1-4 This is sample case with verse number
		//====================Result==================
		//\c 1
		//\v 1-4 This is sample case with verse number
		[Test]
		public void VerseNumberInsertContentWhenAllVersesAreEmpty()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 1;
			currentTask.VerseEnd = 4;
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "WithoutParatextDataContent.sfm"));
			string transcription = "This is sample case with verse number";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInsertContentWhenAllVersesAreEmpty.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInsertContentWhenAllVersesAreEmpty.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription);
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 8
		//==================Paratext==================
		//\id LUK - Transcriber Test Project
		//\toc1 The Gospel According to Luke
		//===================Transcribe===============
		//\v 1-4 This is sample case with verse number
		//====================Result==================
		//\id LUK - Transcriber Test Project
		//\toc1 The Gospel According to Luke
		//\c 1
		//\v 1-4 This is sample case with verse number
		[Test]
		public void VerseNumberInsertContentWhenNoChapterAndVerse()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 1;
			currentTask.VerseEnd = 4;
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "ParatextDataWithoutChapterAndVerse.sfm"));
			string transcription = "This is sample case with verse number";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInsertContentWhenNoChapterAndVerse.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInsertContentWhenNoChapterAndVerse.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription);
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 9
		//==================Paratext==================
		//\id LUK - Transcriber Test Project
		//\toc1 The Gospel According to Luke
		//toc2 Luke
		//toc3 LUK
		//===================Transcribe===============
		//\s1 Introduction
		//\v 1-4 This is sample case with verse number with heading
		//====================Result==================
		//\id LUK - Transcriber Test Project
		//\toc1 The Gospel According to Luke
		//toc2 Luke
		//toc3 LUK
		//\c 1
		//\s1 Introduction
		//\p \v 1-4 This is sample case with verse number with heading
		[Test]
		public void VerseNumberInsertContentWhenNoChapterAndVerseAndHeading()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 1;
			currentTask.VerseEnd = 4;
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "ParatextDataWithoutChapterAndVerse.sfm"));
			string transcription = "This is sample case with verse number with heading";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInsertContentWhenNoChapterAndVerseAndHeading.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInsertContentWhenNoChapterAndVerseAndHeading.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription, "Introduction");
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 10
		//==================Paratext==================
		//\id LUK - Transcriber Test Project
		//\toc1 The Gospel According to Luke
		//toc2 Luke
		//toc3 LUK
		//\c 1
		//\s1 Introduction
		//\p \v 1-4 This is sample case with verse number with heading
		//===================Transcribe===============
		//\s1 New Introduction
		//\v 1-4 This is another sample case with verse number with heading
		//====================Result==================
		//\id LUK - Transcriber Test Project
		//\toc1 The Gospel According to Luke
		//toc2 Luke
		//toc3 LUK
		//\c 1
		//\s1 New Introduction
		//\p \v 1-4 This is another sample case with verse number with heading
		[Test]
		public void VerseNumberInsertContentWhenExistingChapterAndVerseAndHeading()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 1;
			currentTask.VerseEnd = 4;
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "VerseNumberInsertContentWhenExistingChapterAndVerseAndHeading.sfm"));
			string transcription = "This is another sample case with verse number with heading";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInsertContentWhenExistingChapterAndVerseAndHeading.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInsertContentWhenExistingChapterAndVerseAndHeading.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription, "New Introduction");
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}

		//// Case 11
		//==================Paratext==================
		//\id LUK - Transcriber Test Project
		//\toc1 The Gospel According to Luke
		//toc2 Luke
		//toc3 LUK
		//\c 1
		//\s1 Introduction
		//\v 1-4 This is sample case with verse number  with heading
		//===================Transcribe===============
		//\s1 My Section
		//\v 5-25 This is sample case of second set of verse number  with heading
		//====================Result==================
		//\id LUK - Transcriber Test Project
		//\toc1 The Gospel According to Luke
		//toc2 Luke
		//toc3 LUK
		//\c 1
		//\s1 Introduction
		//\p \v 1-4 This is sample case with verse number
		//\s1 My Section
		//\p \v 5-25 This is sample case of second set of verse number with heading

		[Test]
		public void VerseNumberInsertContentWhenChapterAndFirstVerseAndHeading()
		{
			Task currentTask = new Task();
			currentTask.ChapterNumber = 1;
			currentTask.VerseStart = 5;
			currentTask.VerseEnd = 25;
			string chapterContent = File.ReadAllText(Path.Combine(_inputPath, "VerseNumberInsertContentWhenExistingChapterAndVerseAndHeading.sfm"));
			string transcription = "This is sample case of second set of verse number with heading";
			string outputFilePath = Path.Combine(_outputPath, "VerseNumberInsertContentWhenChapterAndFirstVerseAndHeading.sfm");
			string expectedFilePath = Path.Combine(_expectedPath, "VerseNumberInsertContentWhenChapterAndFirstVerseAndHeading.sfm");
			StringBuilder sb = GenerateParatextData(currentTask, chapterContent, transcription, "My Section");
			File.WriteAllText(outputFilePath, sb.ToString());
			TextFileAssert.AreEqual(outputFilePath, expectedFilePath);
		}
	}
}
