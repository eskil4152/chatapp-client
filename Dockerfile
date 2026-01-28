FROM node:25-alpine3.22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY .env.production .
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]