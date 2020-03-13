FROM node:slim

COPY . .

RUN npm i

CMD [ "node", "./main.js" ]

