FROM node:18

RUN apt-get update -y
RUN apt-get install -y ffmpeg python3-pip
RUN pip3 install yt-dlp
RUN apt-get clean

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]