#!/usr/bin/bash
npm run build
cd ../../../UpdateSharedResources
dotnet run ../portable/ReactUi/react/build ../portable/ReactShared/ReactShared.csproj
cd ../portable/ReactShared
rm -rf data
mkdir data
cp ../ReactUi/data/*.xsd data
cp ../ReactUi/data/*.xml data
cp ../ReactUi/data/*.eaf data
cd data
mkdir localization
cp ../../ReactUi/data/localization/*.json localization
cd ..
rm -rf react
mkdir react
cd react
mkdir build
cp -r ../../ReactUi/react/build/* build
cd ..
dotnet build
