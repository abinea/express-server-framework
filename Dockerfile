FROM node:16.19.1

WORKDIR /usr/app/node-server
COPY . .
RUN npm install

EXPOSE 9000
CMD npm run start