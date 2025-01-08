# !bin/bash

# PRODUCTION
git reset --hard
git checkout master
git pull origin master

npm install yarn -g
yarn global add serve
yarn
yarn run build
pm2 start "yarn run start:prod" --name=ANDYMOBILE-REACT

# DEVELOPMENT
# npm i yarn -g
# pm2 start "yarn run start" --name=ANDYMOBILE-REACT