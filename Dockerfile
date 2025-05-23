FROM node:18

RUN apt-get update -y && \
    apt-get install -y ffmpeg python3-pip && \
    pip3 install yt-dlp && \
    apt-get clean

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]