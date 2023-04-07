FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]