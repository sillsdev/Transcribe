call npm run build
cd ..\..\..\UpdateSharedResources
dotnet run ..\portable\ReactUi\react\build ..\portable\ReactShared\ReactShared.csproj
cd ..\portable\ReactShared
rmdir /s/q data
mkdir data
copy ..\ReactUi\data\*.xsd data
copy ..\ReactUi\data\*.xml data
copy ..\ReactUi\data\*.eaf data
cd data
mkdir localization
copy ..\..\ReactUi\data\localization\*.json localization
cd ..
rmdir /s/q react
mkdir react
cd react
mkdir build
xcopy /s/y ..\..\ReactUi\react\build\* build
cd ..
dotnet build
cd ..\ReactUi\react
cmd /c npm run jest
