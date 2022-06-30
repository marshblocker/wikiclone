FROM node:alpine

WORKDIR /ng-app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 4200

CMD /ng-app/node_modules/.bin/ng serve --host 0.0.0.0