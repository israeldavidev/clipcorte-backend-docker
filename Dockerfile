FROM node:18

RUN apt-get update -y && \
    apt-get install -y ffmpeg python3-pip curl && \
    curl -L https://yt-dlp.org/downloads/latest/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]