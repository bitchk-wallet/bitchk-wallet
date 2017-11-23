#!/bin/bash
if [ "$#" -ne 2 ]
then
  echo "must 2 param first target second store pass"
  echo "ex) finish.sh yangcoin yangchigi"
  exit
fi

npm run clean-all&&npm run apply:target --target=$1&&npm run final:android --pass=$2&&npm run final:ios;npm run open:ios;grunt pack-all
#cordova run android --device;cordova run ios --device
