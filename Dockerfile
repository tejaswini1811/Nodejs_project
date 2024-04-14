FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g npm@10.5.2

RUN npm install --force

EXPOSE 3000

CMD npm run dev
