
FROM node:latest AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
COPY . .

FROM nginx:alpine AS serve
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY --from=builder /usr/src/app/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]