#stage 1
FROM node:20-alpine as node
WORKDIR /app
COPY . .
RUN npm install -g npm@11.6.2
RUN export NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build-prod
COPY ./web.config /app/dist/stmt-ai-app
COPY ./web.config /app/dist/stmt-ai-app

#stage 2
FROM nginx:1.20.1
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/stmt-ai-app/browser /usr/share/nginx/html
