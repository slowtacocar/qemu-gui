FROM node
WORKDIR /usr/src/app
COPY package.json .
RUN apt-get update && apt-get install -y qemu-system-x86
RUN npm install
EXPOSE 8443
EXPOSE 8080
CMD [ "npm", "start" ]
COPY . .
