FROM node:16.19.0

COPY . /Andymobile-react
WORKDIR /Andymobile-react
CMD npm i yarn -g && yarn install && yarn run build && yarn run start:prod