FROM node
WORKDIR /usr/src/app
COPY . .
RUN apt-get update && apt-get install -y qemu-system-x86
RUN npm install
RUN npm run build
EXPOSE 8443
EXPOSE 8080
CMD [ "npm", "start" ]
