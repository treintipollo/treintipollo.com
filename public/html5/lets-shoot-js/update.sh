#!/bin/sh

mkdir tmp
cd tmp

git init
git remote add origin git@bitbucket.org:diegomarquez/lets-shoot-arcade.git
git pull --rebase origin master

rsync -a ./html5/* ../

cd ..

rm -rf ./tmp
rm index.js
rm package.json
rm package-lock.json

# Set the random cache busting string
command='s/@@cache-bust@@/'${RANDOM}'/g'
fileName='index.html'

# Because this script was made for a MAC, sed requires the empty second argument
sed -i '' "$command" "$fileName"