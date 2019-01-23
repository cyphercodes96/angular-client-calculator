FROM node:carbon

WORKDIR /app

COPY package*.json ./

RUN npm install

# for production builds:
#RUN npm install --only=production

COPY . .

RUN ln -s /app/node_modules/@angular/cli/bin/ng /usr/local/bin

EXPOSE 3325

CMD ["npm", "start"]
