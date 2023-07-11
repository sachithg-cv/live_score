FROM node:18.7.0-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm i
COPY . .
RUN npm run build
CMD ["npm","run","start"]