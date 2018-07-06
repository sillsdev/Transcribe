# Folder and File Structure

This document describes how the task id is used to create the folder and file name where the task will be located. This information is used to find and load the file.

A sample task id might be: `NIV11-LUK-001-001004` This task id helps identify the content of the file and its location. The structure is AAAAA-BBB-CCC-DDDEEE. The parts mean:
- AAAAA = a short project designator. Can contain letters and numbers. Probably starts with a letter.
- BBB = For Scripture this will be the book designator which is three characters, letters and numbers. 
- CCC = for Scripture this will be the chapter number.
- DDD = for Scripture this will be the starting verse number.
- EEE = for Scripture this will be the ending verse number.

On a Windows computer, the files will be located in the folder tree at `C:\ProgramData\SIL\Transcriber`. This location was chosen because it can be shared by all the users working on the computer. In this folder, we are currently proposing the tasks.xml and users.xml files will be present. The tasks.xml file will describe the tasks for all the projects on the computer. (If at some future time it is determined that this file become megabytes in size, we may revisit this decision.)

Also in this folder will be one folder for each project (named with the projects short name given by AAAAA above.) So to diagram the structure, it would be:
* AAAAA
  * BBB
    * CCC
	  * AAAAA-BBB-CCC-DDDEEEv01.mp3
	  * AAAAA-BBB-CCC-DDDEEEv01.txt
	  * AAAAA-BBB-CCC-DDDEEEv01.eaf
	  
![Hierarchy](https://github.com/sillsdev/Transcribe/blob/master/src/portable/ReactUi/data/FoldersAndFiles.PNG)

You will note that the hyphens in the name indicate that what proceeds it is a folder name in the hierarchy. This was done to keep the relevant data together and to keep the number of files and folder names in any given folder smaller ... preferably less than 100.

Also notice that the task designator doesn't include the version number of the files. The file names ends with v and a two digit version number. The _Transcriber_ loads the last version available. In the future, they may be a way to compare versions but the comparison of text versions can also be done in Paratext.

The transcription will be saved in a file in the same folder as the media file with the same name. It can be saved in one of two formats: eaf (an XML format which allows segments to be marked) and txt which is a simple textual representation.
