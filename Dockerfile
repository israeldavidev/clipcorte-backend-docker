FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Instalar ffmpeg e yt-dlp nativamente
RUN apt-get update && apt-get install -y ffmpeg python3-pip && pip3 install yt-dlp

COPY . .

CMD ["node", "server.js"]
