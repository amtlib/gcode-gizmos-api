FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]