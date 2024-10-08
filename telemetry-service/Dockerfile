FROM node:20.8.1
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm ci
COPY . /app
CMD ["node","app.js"]
