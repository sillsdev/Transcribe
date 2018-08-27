using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Transcribe.Windows.Tests
{
	public static class Common
	{
		/// <summary>
		/// Make sure the path contains the proper / for the operating system.
		/// </summary>
		/// <param name="path1"></param>
		/// <param name="path2"></param>
		/// <returns>normalized path</returns>
		public static string PathCombine(string path1, string path2)
		{
			path1 = DirectoryPathReplace(path1);
			path2 = DirectoryPathReplace(path2);
			if (path1 == null)
			{
				return path2;
			}
			else if (path2 == null)
			{
				return path1;
			}
			else
			{
				return Path.Combine(path1, path2);
			}
		}

		/// <summary>
		/// Make sure the path contains the proper / for the operating system.
		/// </summary>
		/// <param name="path">input path</param>
		/// <returns>normalized path</returns>
		public static string DirectoryPathReplace(string path)
		{
			if (String.IsNullOrEmpty(path)) return path;

			string returnPath = path.Replace('/', Path.DirectorySeparatorChar);
			returnPath = returnPath.Replace('\\', Path.DirectorySeparatorChar);
			return returnPath;

		}

		/// <summary>
		/// Make sure the path contains the proper / for the operating system.
		/// </summary>
		/// <param name="path">input path</param>
		/// <returns>normalized with "/" path</returns>
		public static string DirectoryPathReplaceWithSlash(string path)
		{
			if (String.IsNullOrEmpty(path)) return path;
			string returnPath = path.Replace('\\', '/');
			returnPath = returnPath.Replace(Path.DirectorySeparatorChar, '/');
			return returnPath;
		}

		/// <summary>
		/// Deletes the current Directory
		/// </summary>
		/// <param name="directoryPath">Directory name to be deleted</param>
		/// <returns>true/false based on success/failure</returns>
		public static bool DeleteDirectory(string directoryPath)
		{
			bool deleted = false;
			if (Directory.Exists(directoryPath))
			{
				try
				{
					DirectoryInfo dirInfo = new DirectoryInfo(directoryPath);
					bool isReadOnly = ((File.GetAttributes(directoryPath) & FileAttributes.ReadOnly) ==
					                   FileAttributes.ReadOnly);
					if (isReadOnly)
					{
						dirInfo.Attributes = FileAttributes.Normal;
					}
					dirInfo.Delete(true);
					WaitForDirectoryToBecomeEmpty(dirInfo);
					deleted = true;
				}
				catch (Exception ex)
				{
					Console.Write(ex.Message);
				}
			}
			return deleted;
		}

		private static void WaitForDirectoryToBecomeEmpty(DirectoryInfo di)
		{
			try
			{
				for (int i = 0; i < 5; i++)
				{
					if (di.GetFileSystemInfos().Length == 0)
						return;
					Console.WriteLine(di.FullName + i);
					Thread.Sleep(50 * i);
				}
			}
			catch (Exception)
			{
				// Directory doesn't exist
			}
		}

		public static string Bin(string currentDir, string addedPath)
		{
			var projFolder = currentDir.Remove(currentDir.IndexOf(Path.DirectorySeparatorChar + "bin" + Path.DirectorySeparatorChar,StringComparison.Ordinal));
			return PathCombine(projFolder, addedPath);
		}
	}
}
