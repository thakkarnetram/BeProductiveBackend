FROM node:18.14.2 as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8082

CMD ["node","app.js"]
