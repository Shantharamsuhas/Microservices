FROM node:12

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 8080

EXPOSE 8080

CMD ["node", "server.js"]
# RUN chmod +x /wait-for-it.sh
