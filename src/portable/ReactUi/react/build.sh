#/bin/bash
npm run build
cd ../../../UpdateSharedResources
dotnet-sdk.dotnet run ../portable/ReactUi/react/build ../portable/ReactShared/ReactShared.csproj
cd ../portable/ReactShared
rm -rf data
mkdir data
cp -a ../ReactUi/data/*.xsd data
cp -a ../ReactUi/data/*.xml data
cp -a ../ReactUi/data/*.eaf data
cd data
mkdir localization
cp -a ../../ReactUi/data/localization/*.json localization
cd ..
rm -rf react
mkdir react
cd react
mkdir build
cp -a ../../ReactUi/react/build/* build
cd ..
dotnet-sdk.dotnet build
cd ../ReactUi/react
npm run jest -- --json --outputFile=./TestResult.json
#find "numFailedTests"":0," <./TestResult.json >nul
