FROM node:alpine

WORKDIR /app

COPY package.json .

RUN yarn --prod=true

COPY . .

CMD ["yarn", "start"]