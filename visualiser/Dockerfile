FROM node:14

WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT 1311

EXPOSE 1311

CMD ["node", "server.js"]
# RUN chmod +x /wait-for-it.sh
