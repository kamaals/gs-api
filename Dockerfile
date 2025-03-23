FROM node:alpine

EXPOSE 3100

WORKDIR /app

COPY package.json ./
COPY ./ ./
RUN yarn install

CMD ["yarn", "start"]
