#!/bin/bash
if [ "$#" -ne 2 ]
then
  echo "must 2 param first target second store pass"
  echo "ex) fast.sh yangcoin yangchigi"
  exit
fi

git pull&&npm run apply:target2 --appname=$1&&npm run final:android --pass=$2&&npm run final:ios;npm run open:ios;grunt pack-all
#cordova run android --device;cordova run ios --device
