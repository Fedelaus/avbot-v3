FROM node:12.18.3

WORKDIR /usr/src/app

# Copy package(-lock).json
COPY package*.json /usr/src/app/

RUN apt -y update
RUN apt install -y git vim ffmpeg sox screen

RUN apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates

# Install npm dependencies
RUN npm install

# Copy over AvBot code
COPY ./ /usr/src/app/

# The command to start the bot
CMD ["npm", "start"]
