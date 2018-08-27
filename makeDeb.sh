#!/bin/bash
# makeDeb.sh -- Creates release pacakges of SIL Transcriber
#               First optional parameter is a version number e.g. 6.2.2.20
#
# Author: Greg Trihus <greg_trihus@sil.org>
# Date: 2018-08-23

RELEASE=${1:-"0.3.1.70"}
rm -rf ../siltranscriber-*
rm -rf ../siltranscriber_*
mkdir ../siltranscriber-${RELEASE}
#git archive HEAD | tar -x -C ../siltranscriber-${RELEASE} || exit 2
#cd ../siltranscriber-${RELEASE}
cp -r . ../siltranscriber-${RELEASE}
rm -rf ../siltranscriber-${RELEASE}/.git
cp debian/changelog ../siltranscriber-${RELEASE}/debian/.
cp debian/control ../siltranscriber-${RELEASE}/debian/control
cp debian/rules ../siltranscriber-${RELEASE}/debian/rules
#cp -rf ../siltranscriber/debian/source debian/.
#cp ../siltranscriber/DistFiles/*.csproj DistFiles/.
cd ..

# Delete unwanted non-source files here using find
find siltranscriber-${RELEASE} -type f -iname "*.hhc" -delete
#find siltranscriber-${RELEASE} -type f -iname "*.dll" -delete
find siltranscriber-${RELEASE} -type f -iname "*.exe" -delete
find siltranscriber-${RELEASE} -type d -iname bin -exec rm -rf {} \;
find siltranscriber-${RELEASE} -type d -iname obj -exec rm -rf {} \;

# Tar it up and create symlink for .orig.bz2
tar jcf siltranscriber-${RELEASE}.tar.bz2 siltranscriber-${RELEASE} || exit 3
ln -fs siltranscriber-${RELEASE}.tar.bz2 siltranscriber_${RELEASE}.orig.tar.bz2

# Do an initial unsigned source build in host OS environment
cd siltranscriber-${RELEASE}

if [ "$(dpkg --print-architecture)" == "amd64" ]; then
   debuild -eBUILD_NUMBER=${RELEASE} -ebinsrc=${PWD} -us -uc || exit 4
else
   dpkg-buildpackage -eBUILD_NUMBER=${RELEASE} -ePlatform=x86 -ebinsrc=${PWD} -us -uc || exit 4
fi
cd ..

