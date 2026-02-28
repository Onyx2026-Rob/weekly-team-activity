FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

COPY . .
RUN npm run build

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]
