ifndef prefix
prefix=/usr
endif
ifndef binsrc
binsrc=${PWD}
endif
ifndef bindst
bindst=$(binsrc)/output/Release
endif
ifndef BUILD_NUMBER
BUILD_NUMBER=0.3.1.67
endif
ifndef Platform
Platform=Any CPU
endif
ifndef MONO_PREFIX
MONO_PREFIX=/opt/mono5-sil
endif
ifndef GDK_SHARP
GDK_SHARP=/opt/mono4-sil/lib/mono/gtk-sharp-3.0
endif
ifndef LD_LIBRARY_PATH
LD_LIBRARY_PATH=$(MONO_PREFIX)/lib
endif
ifndef PKG_CONFIG_PATH
PKG_CONFIG_PATH=$(MONO_PREFIX)/lib/pkgconfig
endif
ifndef MONO_GAC_PREFIX
MONO_GAC_PREFIX=$(MONO_PREFIX)
endif
ifndef MONO_MWF_SCALING
MONO_MWF_SCALING=disable
endif
PATH := $(MONO_PREFIX)/bin:$(PATH)

build:
	#sudo apt install npm -y
	cd $(binsrc)/src/portable/ReactUi/react; npm install
	#cd $(binsrc)/src/portable/ReactUi/react; npm run test all
	cd $(binsrc)/src/portable/ReactUi/react; npm run build
	#sudo apt install nuget -y
	#Need 2.12 of nuget not available on package repo but at:
	#https://github.com/mono/nuget-binary/tree/2.12
	#sudo git clone https://github.com/mono/nuget-binary.git /usr/lib/nuget
	nuget Restore $(binsrc)/Transcribe.Windows.sln
	rm -rf $(binsrc)/src/portable/ReactShared/react/build/*
	cp -r $(binsrc)/src/portable/ReactUi/react/build/* $(binsrc)/src/portable/ReactShared/react/build/.
	mkdir -p $(binsrc)/src/portable/ReactShared/data/localization
	cp $(binsrc)/src/portable/ReactUi/data/localization/strings.json $(binsrc)/src/portable/ReactShared/data/localization/.
	cp $(binsrc)/src/portable/ReactUi/data/tasks.xsd $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/tasksInit.xml $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/tasksSample.xml $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/transcription.eaf $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/users.xsd $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/usersInit.xml $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/usersSample.xml $(binsrc)/src/portable/ReactShared/data/.
	cd $(binsrc)/src/portable/ReactShared; dotnet build
	mkdir -p $(bindst)
	cp $(binsrc)/src/portable/ReactShared/bin/Debug/netstandard2.0/* $(bindst)
	xbuild /t:Rebuild /p:SolutionDir=$(binsrc)/\;PostBuildEvent= $(binsrc)/src/UpdateEmbeddedResourceNames/UpdateEmbeddedResourceNames.csproj
	mono $(binsrc)/src/UpdateEmbeddedResourceNames/bin/Debug/UpdateEmbeddedResourceNames.exe $(SolutionDir)src/portable/ReactShared/react/build $(SolutionDir)src/portable/ReactShared/ReactShared.csproj
	xbuild /t:Rebuild /p:SolutionDir=$(binsrc)/\;Platform=x86\;Configuration=Release\;OutputPath=$(bindst) $(binsrc)/src/SimpleServer/SimpleServer.csproj
	xbuild /t:Rebuild /p:SolutionDir=$(binsrc)/\;Platform=x86\;Configuration=Release\;OutputPath=$(bindst) $(binsrc)/src/portable/Transcribe.Linux/Transcribe.Linux.csproj
	cp $(binsrc)/src/portable/Transcribe.Linux/runmono $(bindst)
	cp -r $(binsrc)/packages/Geckofx45.64.Linux.45.0.36/content/Firefox-Linux64 $(bindst)/.

debug:
	sudo apt install npm -y
	cd $(binsrc)/src/portable/ReactUi/react; npm install
	#cd $(binsrc)/src/portable/ReactUi/react; npm run test
	cd $(binsrc)/src/portable/ReactUi/react; npm run build
	sudo apt install nuget -y
	nuget Restore $(binsrc)/Transcribe.Windows.sln
	rm -rf $(binsrc)/src/portable/ReactShared/react/build/*
	cp -r $(binsrc)/src/portable/ReactUi/react/build/* $(binsrc)/src/portable/ReactShared/react/build/.
	mkdir -p $(binsrc)/src/portable/ReactShared/data/localization
	cp $(binsrc)/src/portable/ReactUi/data/localization/strings.json $(binsrc)/src/portable/ReactShared/data/localization/.
	cp $(binsrc)/src/portable/ReactUi/data/tasks.xsd $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/tasksInit.xml $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/tasksSample.xml $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/transcription.eaf $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/users.xsd $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/usersInit.xml $(binsrc)/src/portable/ReactShared/data/.
	cp $(binsrc)/src/portable/ReactUi/data/usersSample.xml $(binsrc)/src/portable/ReactShared/data/.
	cd $(binsrc)/src/portable/ReactShared; dotnet build
	mkdir -p $(bindst)
	cp $(binsrc)/src/portable/ReactShared/bin/Debug/netstandard2.0/* $(bindst)
	xbuild /t:Rebuild /p:SolutionDir=$(binsrc)/\;PostBuildEvent= $(binsrc)/src/UpdateEmbeddedResourceNames/UpdateEmbeddedResourceNames.csproj
	mono $(binsrc)/src/UpdateEmbeddedResourceNames/bin/Debug/UpdateEmbeddedResourceNames.exe $(SolutionDir)src/portable/ReactShared/react/build $(SolutionDir)src/portable/ReactShared/ReactShared.csproj	xbuild /t:Rebuild /p:SolutionDir=$(binsrc)/\;Platform=x86\;Configuration=Debug\;OutputPath=$(bindst) $(binsrc)/src/SimpleServer/SimpleServer.csproj
	xbuild /t:Rebuild /p:SolutionDir=$(binsrc)/\;Platform=x86\;Configuration=Debug\;OutputPath=$(bindst) $(binsrc)/src/portable/Transcribe.Linux/Transcribe.Linux.csproj
	cp $(binsrc)/src/portable/Transcribe.Linux/runmono $(bindst)
	cp -r $(binsrc)/packages/Geckofx45.64.Linux.45.0.36/content/Firefox-Linux64 $(bindst)/.

tests:
	nunit-console -exclude=SkipOnTeamCity\;LongTest -labels -nodots output/Debug/Test.dll

install:
	mkdir -p $(DESTDIR)$(prefix)/lib/siltranscriber
	cp -r $(bindst)/. $(DESTDIR)$(prefix)/lib/siltranscriber
	mkdir -p $(DESTDIR)$(prefix)/bin
	cp src/siltranscriber.sh $(DESTDIR)$(prefix)/bin/siltranscriber
	mkdir -p $(DESTDIR)$(prefix)/share/python-support
	chmod 777 $(DESTDIR)$(prefix)/share/python-support
	mkdir -p $(DESTDIR)$(prefix)/share/doc/siltranscriber
	chmod 777 $(DESTDIR)$(prefix)/share/doc/siltranscriber
	mkdir -p $(DESTDIR)$(prefix)/share/siltranscriber
	chmod 777 $(DESTDIR)$(prefix)/share/siltranscriber
	mkdir -p $(DESTDIR)$(prefix)/share/applications
	chmod 777 $(DESTDIR)$(prefix)/share/applications
	cp debian/*.desktop $(DESTDIR)$(prefix)/share/applications
	mkdir -p $(DESTDIR)$(prefix)/share/pixmaps
	chmod 777 $(DESTDIR)$(prefix)/share/pixmaps
	cp debian/*.png $(DESTDIR)$(prefix)/share/pixmaps
	#cp debian/*.xpm $(DESTDIR)$(prefix)/share/pixmaps
	mkdir -p $(DESTDIR)$(prefix)/share/man
	chmod 777 $(DESTDIR)$(prefix)/share/man

binary:
	exit 0

clean:
	rm -rf output/* $(binsrc)/src/portable/ReactUi/react/build/*
	rm -rf $(binsrc)/src/portable/ReactShared/react/build/* $(binsrc)/src/portable/ReactShared/react/data/*

uninstall:
	-sudo apt-get -y remove siltranscriber
	sudo rm -rf $(DESTDIR)$(prefix)/lib/siltranscriber
	sudo rm $(DESTDIR)$(prefix)/bin/siltranscriber
	sudo rm -rf $(DESTDIR)$(prefix)/share/doc/siltranscriber
	sudo rm -rf $(DESTDIR)$(prefix)/share/siltranscriber
	-xdg-desktop-menu uninstall /etc/pathway/sil-transcriber.desktop
	-rm -rf ~/.local/share/SIL/Transcriber

clean-build:
	rm -rf debian/siltranscriber bin
	rm -f debian/*.log *.log debian/*.debhelper debian/*.substvars debian/files
	rm -f *.dsc pathway_*.tar.gz pathway_*.build pathway_*.diff.gz
	rm -f *.changes pathway*.deb


