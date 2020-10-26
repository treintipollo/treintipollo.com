mkdir tmp
cd tmp

git init
git remote add origin git@bitbucket.org:diegomarquez/lets-shoot-arcade.git
git pull origin master

rsync -a ./html5/* ../

cd ..

rm -rf ./tmp
rm index.js
rm package.json
rm package-lock.json