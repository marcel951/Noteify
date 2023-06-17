FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install mariadb-client -y
RUN npm ci
COPY . .
CMD ["npm", "start"]
