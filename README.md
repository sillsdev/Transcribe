# Transcribe
Transcription of minority audio for review by Paratext

This project uses a react redux ui which is displayed in a GeckoFx browser control (on Windows).

## Installing build dependencies
1. Use the Visual Studio installer to install the first and last workload options (C# with .net Frameworks and dotnet core) and on the individual items you can install Git for Windows and the Vistual Studio git extensions
1. Install the VsCode Microsoft editor for use with editing the react redux interface (from the src\portable\ReactUI\react folder. You may also like to add extensions for edition sass files.
1. Install node.js for managing dependencies on Javascript

## Installing and running the user interface from a web browser (no server)
1. `git clone https://github.com/sillsdev/Transcribe.git`
1. `cd src/portable/ReactUi/react`
1. `npm install`
1. `copy src\portable\ReactUi\data\api src/portable/ReactUi/react/public/`
1. `copy src/portable/ReactUi/data/localization src/portable/ReactUi/react/public/`
1. `npm start`

## To build the program on Windows
1. `git clone https://github.com/sillsdev/Transcribe.git`
1. `cmd /c initial-setup.bat` (from the checkout folder)
1. `launch Transcribe.Windows.sln` (in Visual Studio 2017)
(Configuration works as Debug and x86. Release works too. GeckoFx requires x86.)
1. Right click on `Transcribe.Windows` in the solution explorer and rebuild it.
1. Right click on `Transcribe.Windows` and select `Set as Startup project`
1. Click `Start` on the toolbar
(The installer builds from Visual Studio 2015 with Wix 3.10 installed and requires you build BuildStep first.)

## To build for Linux
1. The Linux build is actually done on a windows machine. This is because mono5 which is used for building on Linux can't accept .net core assemblies as dependencies.
1. The build instructions are the same as those above except `Transcribe.Windows` is replaced with `Transcribe.Linux`.
1. Binaries built in this way can be used to replace the /usr/lib/siltranscriber binaries or they can be launched from any folder with the command `./runmono mono Transcribe.Linux.exe` (Building depends on mono5sil but executing will work with mono4sil)

## Updating localizations
There is a file: [localizationReadMe.md](src\portable\ReactUi\data\localization\localizationReadMe.md) which describes how to update rebuild and include the localizations.

## Architecture overview
When Transcribe.Windows is executed, it launches the SimpleServer code. It tries to use the localhost port 3010 to serve the files from the react\build folder (which are installed by the Windows program in a temporary folder). Then the GeckoFx Browser control navigates to this port address to load the interface.

The browser control is monitoring the HTTP requests. When it observes a request that begins with /api/ it interprets it as an API request for the C# to respond to. The application data is in the default location in ProgramData, company name, and application name (usually: C:\ProgramData\SIL\SIL Transcriber on Windows).

## These are GET requests:
- `GetUsers` - loads the list of all users.
- `GetTasks` - loads the list of all tasks.
- `GetTasks?user=<username>` - loads that list of tasks that are available to the `<username>`.
- `GetParatextProjects` - loads a list of Paratext 8 rojects currently on the computer.
- `GetDefaultHotKeys` - used to reset the hotkeys to default values.
- `GetZttProjectsCount` - finds next number for project id.

## This is a PUT request:
- `TaskEvent?action=<action>&task=<task>&user=<user>&heading=<heading>` - records an action (see XML schema) on the task. The Upload event uploads the data to Paratext if possible.
- `UpdateUser?user=<user>&project=<project>&<tag>=<value>` - updates value in user data (including the avatar which is passed in the message body).
- `UpdateProjectAvatar?project=<project>` - updates the project image with  the avatar which is passed in the message body.
- `DeleteUser?user=<user>` - deletes the user data
- `UpdateAvatar?user=<user>` - The json object for the state of AvatarEdit is passed as the body. This request updates user with uri to newly created image file.
- `UpdateProject?id=<project>&name=<name>&guid=<guid>&lang=<lang>&langName=<langName>&font=<font>&size=<size>&features=<features>&dir=<direction>&sync=<sync>&claim=<claim>&type=<type>` - update (or create) values for the project
- `WriteTranscription?task=<taskid>&length=<value>&lang=<value>&dir=<value>` - The json object for the state of Edit pane. This request writes out the eaf file next to the audio file.
- `ReportPosition?task=<taskid>&position=<value>` - saves the audio play position in the task file.
- `UpdateTask?task=<taskid>&project=<projectid>&audioFile=<audioFileName>&reference=<scriptureReference>&heading=<headingText>&assignedTo=<userid>&timeDuration=<recordingLengthInMilliseconds>` - The json object for the audio file contents  is passed as the request body. The request updates value in task data.
- `DeleteTask?task=<taskid>` - deletes the task data.
- `DeleteUser?User=<userid>` - deletes the user data.
- `CopyToClipboard?task=<taskid>` - Copies transcription for task to operating system clipboard.
- `AddManyTasks?user=<userid>&task=<taskid>` - brings up folder browser and loads spreadsheet of tasks and/ or the audio files contained in the folder.
- `ShowHelp?topic=<topicEntry>` - Displays help and positions to topicEntry.
- `GetMeta?fileName=<filename>` - returns duration of audio (contained in the message body) and eventually waveform.

### List of tags for UpdateUser api
- name
- uilang
- font
- fontsize
- playpause
- back
- forward
- slower
- faster
- setting (name of the setting -- use with value)
- value (value of the setting -- use with setting)

