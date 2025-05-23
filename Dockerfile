FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

# Instalar ffmpeg e yt-dlp via apt/pip
RUN apt-get update && \
    apt-get install -y ffmpeg python3-pip && \
    pip3 install yt-dlp

COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]
