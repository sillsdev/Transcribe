I updated the C# script that builds the strings.json file. We still need to update English localization in 

src\portable\ReactUi\data\localization\TranscriberUi-en-1.2.xliff

After you do that, I will upload this file to the crowdin site and when I do that all the translators are informed of the additional strings.

We can continue to "mock" translations using Google Translator if we want although once the translators on crowdin do their work their translations will be used in preference to the ones we have provided. These translations are kept in files with names like: TranscriberUi-fr.xlf (with the target language code following the hyphen. The target language code is also in the file.)

When we want to build the localization file, as the admin on the crowdin site, I push a button which creates a downloaded file with all the latest translations.

To build the strings.json file, the file of localized strings is downloaded (by anyone) and placed in the folder: 

src\portable\ReactUi\data\localization

It is unzipped their which creates subfolders for each language. Then the  localization program can be run either from Visual Studio or from the command prompt:

dotnet run

Once it finishes, strings.json is in the folder. The next time you use:

cmd /c build.bat

it will be included in the build. If you want it to be used with

npm start

you should also copy it to the folder

src\portable\ReactUi\react\public\localization

We will also include it on the repo. This gives us more control over when the strings in the program are updated. The build on Team City is using the strings.json that we have checked in.