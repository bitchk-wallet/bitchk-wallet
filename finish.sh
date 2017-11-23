#!/bin/bash
if [ "$#" -ne 2 ]
then
  echo "must 2 param first target second store pass"
  echo "ex) finish.sh yangcoin yangchigi"
  exit
fi

npm run clean-all&&npm run apply:target --target=$1&&npm run final:android --pass=$2&&npm run final:ios;grunt pack-all
