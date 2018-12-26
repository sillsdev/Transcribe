using NUnit.Framework;
using ReactShared;
using System;
using System.IO;
using System.Xml;

namespace Transcribe.Test
{
	public class AddManyTasksTest
	{
		#region Private Variables
		private string _inputPath;
		private string _outputPath;
		private string _expectedPath;
		private string _localPath;
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
			string query = "project=TestProject&name=TestProjectName&guid=&lang=&langName=&font&size=&features=&dir=&sync=&claim=&type=&uri=";
			new UpdateProject(query);
			_localPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
		}
		#endregion

		/// <summary>
		/// Compared the Summary.Txt file created - when the Browse folder has an Excel File in it
		/// </summary>
		[Test]
		public void ExcelFileExistsTest()
		{
			string query="user=TestUser1&project=TestProject";
			AddManyTasks.SelectAudioFilesFolder selectAudioFolder = null;
			new AddManyTasks(query, selectAudioFolder, Path.Combine(_inputPath, "ExcelFileExists") );
			FileAssert.AreEqual(Path.Combine(_inputPath, "ExcelFileExists", "Summary.txt"), Path.Combine(_expectedPath, "ExcelFileExists", "Summary.txt"));
		}

		/// <summary>
		/// Compared the Summary.Txt file created - when the Browse folder has no Excel File in it
		/// </summary>
		[Test]
		public void ExcelFileNotExistsTest()
		{
			string query = "user=TestUser1&project=aai";
			AddManyTasks.SelectAudioFilesFolder selectAudioFolder = null;
			new AddManyTasks(query, selectAudioFolder, Path.Combine(_inputPath, "ExcelFileNotExists"));
			FileAssert.AreEqual(Path.Combine(_inputPath, "ExcelFileNotExists", "Summary.txt"), Path.Combine(_expectedPath, "ExcelFileNotExists", "Summary.txt"));
		}

		/// <summary>
		/// Checks whether the GEN-001-001005.mp3 from the Browse folder is copied to the TestProject
		/// </summary>
		[Test]
		public void CheckIfAudioFileCopiedTest()
		{
			string query = "user=TestUser1&project=TestProject";
			AddManyTasks.SelectAudioFilesFolder selectAudioFolder = null;
			new AddManyTasks(query, selectAudioFolder, Path.Combine(_inputPath, "ExcelFileExists"));
			var projectPath = Path.Combine(_localPath, "TestProject", "GEN", "001", "TestProject-GEN-001-001005v01.mp3");
			Assert.IsTrue(File.Exists(projectPath));
		}

		/// <summary>
		/// Checks whether the TaskId TestProject-GEN-001-001005 gets creaed in the tasks.xml file
		/// </summary>
		[Test]
		public void CheckIfTaskIdCreatedTest()
		{
			string query = "user=TestUser1&project=TestProject";
			AddManyTasks.SelectAudioFilesFolder selectAudioFolder = null;
			new AddManyTasks(query, selectAudioFolder, Path.Combine(_inputPath, "ExcelFileExists"));
			var tasksPath = Path.Combine(_localPath, "Tasks.xml");
			Assert.IsTrue(File.Exists(tasksPath));
			var tasksDoc = new XmlDocument();
			using (var xr = XmlReader.Create(tasksPath))
			{
				tasksDoc.Load(xr);
			}
			var taskNode = tasksDoc.SelectSingleNode($"//project[@id='TestProject']/task[@id='TestProject-GEN-001-001005']") as XmlElement;
			Assert.AreEqual(taskNode.Attributes["id"].Value, "TestProject-GEN-001-001005");
		}

		[TearDown]
		public void TearDown()
		{
			// Delete Summary Files
			var summaryFile1 = Path.Combine(_inputPath, "ExcelFileExists", "Summary.txt");
			if (File.Exists(summaryFile1))
			{
				File.Delete(summaryFile1);
			}
			var summaryFile2 = Path.Combine(_inputPath, "ExcelFileNotExists", "Summary.txt");
			if (File.Exists(summaryFile2))
			{
				File.Delete(summaryFile2);
			}

			// Delete Tasks.xml, Tasks.xsd and the Folder TestPrject created in the Local Folder
			if (Directory.Exists(Path.Combine(_localPath, "TestProject")))
			{
				Directory.Delete(Path.Combine(_localPath, "TestProject"),true);
			}

			if (File.Exists(Path.Combine(_localPath, "tasks.xml")))
			{
				File.Delete(Path.Combine(_localPath, "tasks.xml"));
			}

			if (File.Exists(Path.Combine(_localPath, "tasks.xsd")))
			{
				File.Delete(Path.Combine(_localPath, "tasks.xsd"));
			}
		}
	}
}
