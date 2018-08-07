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
1. `npm run build`
1. `launch Transcribe.Windows.sln` (in Visual Studio 2017)
1. Configuration works as Debug and Any CPU but others will work too.
1. Visual studio will restore the NuGet packages.
1. Right click on `UpdateEmbeddedResourceNames` in the solution explorer and rebuild it.
1. Right click on `Transcribe.Windows` in the solution explorer and rebuild it.
1. `copy packages\Geckofx45.45.0.34\content\Firefox output\Debug\ ` if necessary.
1. Make sure `Transcribe.Windows` is set as the startup project and click `Start` on the tool bar.

When Transcribe.Windows is executed, it launches the SimpleServer code. It tries to use the localhost port 3010 to serve the files from the react\build folder. Then the GeckoFx Browser control navigates to this port address to load the interface.

The browser control is monitoring the HTTP requests. When it observes a request that begins with /api/ it interprets it as an API request for the C# to respond to. The application data is in the default location in ProgramData, company name, and application name.

## These are GET requests:
- `GetUsers` - loads the list of all users
- `GetTasks` - loads the list of all tasks
- `GetTasks?user=<username>` - loads that list of tasks that are available to the `<username>`

## This is a PUT request:
- `TaskEvent?action=<action>&task=<task>&user=<user>` - records an action (see XML schema) on the task
- `UpdateUser?user=<user>&project=<project>&<tag>=<value>` - updates value in user data
- `UpdateAvatar?user=<user>` - The json object for the state of AvatarEdit is passed as the body. This request updates user with uri to newly created image file.
- `WriteTranscription?task=<taskid>&length=<value>&lang=<value>&dir=<value>` - The json object for the state of Edit pane. This request writes out the eaf file next to the audio file.

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

