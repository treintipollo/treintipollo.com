#!/bin/sh

mkdir tmp
cd tmp

git init
git remote add origin git@bitbucket.org:diegomarquez/nukes.git
git pull --rebase origin master

rsync -a ./html5/* ../

cd ..

rm -rf ./tmp

# Set the random cache busting string
command='s/@@cache-bust@@/'${RANDOM}'/g'
fileName='index.html'

# Because this script was made for a MAC, sed requires the empty second argument
sed -i '' "$command" "$fileName"