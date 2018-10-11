# Transcribe
Transcription of minority audio for review by Paratext

This project uses a react redux ui which is displayed in a GeckoFx browser control (on Windows).

## Installing and running the user interface from a web browser (no server)
1. `git clone https://github.com/sillsdev/Transcribe.git`
1. `cd src/portable/ReactUi/react`
1. `npm install`
1. `copy src\portable\ReactUi\data\api src/portable/ReactUi/react/public/`
1. `copy src/portable/ReactUi/data/localization src/portable/ReactUi/react/public/`
1. `npm start`

## To build the program on Windows
1. `git clone https://github.com/sillsdev/Transcribe.git`
1. `cd src/portable/ReactUi/react`
1. `npm install`
1. `rm -rf src/portable/ReactUi/react/public/api` (if present)
1. `rm -rf src/portable/ReactUi/react/public/localization` (if present)
1. `cmd /c build.bat`
1. `launch Transcribe.Windows.sln` (in Visual Studio 2017)
1. Configuration works as Debug and x86. Release works too. GeckoFx may require x86.
1. Visual studio will restore the NuGet packages.
1. Right click on `SimpleServer` in the solution explorer and rebuild it.
1. Right click on `Transcribe.Windows` in the solution explorer and rebuild it.
1. `copy packages\Geckofx45.45.0.34\content\Firefox output\Debug\` (or output\Release) if necessary.
1. Make sure `Transcribe.Windows` is set as the startup project and click `Start` on the tool bar.
1. The installer builds from Visual Studio 2015 with Wix 3.10 installed

## To build on Linux
1. The Linux build is actually done on a windows machine. This is because mono5 which is used for building on Linux can't accept .net core assemblies as dependencies.
1. The build instructions are the same as those above except `Transcribe.Windows` is replaced with `Transcribe.Linux` and instead of using the `Firefox` folder from `Geckofx45.45.0.34` you will need `Firefox-Linux64` renamed as `Firefox` from `packages\Geckofx45.64.Linux.45.0.36`.
1. Binaries built in this way can be used to replace the /usr/lib/siltranscriber binaries or they can be launched from any folder with the command `./runmono mono Transcribe.Linux.exe` (Building depends on mono5sil but executing will work with mono4sil)

When Transcribe.Windows is executed, it launches the SimpleServer code. It tries to use the localhost port 3010 to serve the files from the react\build folder. Then the GeckoFx Browser control navigates to this port address to load the interface.

The browser control is monitoring the HTTP requests. When it observes a request that begins with /api/ it interprets it as an API request for the C# to respond to. The application data is in the default location in ProgramData, company name, and application name.

## These are GET requests:
- `GetUsers` - loads the list of all users
- `GetTasks` - loads the list of all tasks
- `GetTasks?user=<username>` - loads that list of tasks that are available to the `<username>`
- `GetParatextProjects` - loads a list of Paratext 8 rojects currently on the computer.

## This is a PUT request:
- `TaskEvent?action=<action>&task=<task>&user=<user>&heading=<heading>` - records an action (see XML schema) on the task. The Upload event uploads the data to Paratext if possible.
- `UpdateUser?user=<user>&project=<project>&<tag>=<value>` - updates value in user data
- `DeleteUser?user=<user>` - deletes the user data
- `UpdateAvatar?user=<user>` - The json object for the state of AvatarEdit is passed as the body. This request updates user with uri to newly created image file.
- `UpdateProject?id=<project>&name=<name>&guid=<guid>&lang=<lang>&langName=<langName>&font=<font>&size=<size>&features=<features>&dir=<direction>&sync=<sync>&claim=<claim>&type=<type>` - update (or create) values for the project
- `WriteTranscription?task=<taskid>&length=<value>&lang=<value>&dir=<value>` - The json object for the state of Edit pane. This request writes out the eaf file next to the audio file.
- `ReportPosition?task=<taskid>&position=<value>` - saves the audio play position in the task file.
- `UpdateTask?task=<taskid>&project=<projectid>&audioFile=<audioFileName>&reference=<scriptureReference>&heading=<headingText>&assignedTo=<userid>&timeDuration=<recordingLengthInMilliseconds>` - The json object for the audio file contents  is passed as the request body. The request updates value in task data.
- `DeleteTask?task=<taskid>` - deletes the task data.

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

