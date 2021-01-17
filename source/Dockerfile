FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 1337
ENTRYPOINT ["node", "build/index.js"]
