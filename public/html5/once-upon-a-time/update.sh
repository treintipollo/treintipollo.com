mkdir tmp
cd tmp

git init
git remote add origin git@bitbucket.org:diegomarquez/once-upon-a-time.git
git pull --rebase origin master

rsync -a ./* ../

cd ..

rm -rf ./tmp