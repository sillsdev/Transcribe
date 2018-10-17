rem initialize npm repo, update nuget repo and make sure Firefox folders are in output
cd src\portable\ReactUi\react
cmd /c npm i
cmd /c build.bat
cd ..\..\..\..
git clone https://github.com/mono/nuget-binary.git lib/nuget
.\lib\nuget\nuget.exe restore .\Transcribe.Windows.sln
rem dotnet msbuild /t:Rebuild /p:SolutionDir=.\;Configuration=Release;Platform=x86;OutputPath=.\output\Release
xcopy /s/i .\packages\Geckofx45.45.0.34\content\Firefox .\output\Debug\Firefox
xcopy /s/i .\packages\Geckofx45.45.0.34\content\Firefox .\output\Release\Firefox
xcopy /s/i .\packages\Geckofx45.64.Linux.45.0.37\content\Firefox-Linux64 .\src\portable\Transcribe.Linux\bin\Debug\Firefox
xcopy /s/i .\packages\Geckofx45.64.Linux.45.0.37\content\Firefox-Linux64 .\src\portable\Transcribe.Linux\bin\Debug\Firefox
