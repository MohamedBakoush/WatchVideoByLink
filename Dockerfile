FROM node:14

# Create app directory
WORKDIR /watchvideobylink

# Install packaged dependencies
RUN apt-get update ; apt-get install -y git build-essential gcc make yasm autoconf automake cmake libtool checkinstall libmp3lame-dev pkg-config libunwind-dev zlib1g-dev libssl-dev

RUN apt-get update \
    && apt-get clean \
    && apt-get install -y --no-install-recommends libc6-dev libgdiplus wget software-properties-common

# Get untrunc
RUN apt-get install -y libavformat-dev libavcodec-dev libavutil-dev
RUN wget https://github.com/anthwlock/untrunc/archive/master.zip
# unzip master.zip
RUN unzip master.zip
# Delete master.zip
RUN rm -r master.zip
# build untrunc
RUN cd untrunc-master; make  
# build ffmpeg version 3.3.9 for untrunc
RUN apt-get install yasm wget
RUN cd untrunc-master; make FF_VER=3.3.9

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . . 

# Build necessary tasks
RUN npm run build

ENV PORT=8080

EXPOSE 8080

CMD [ "npm", "start" ]