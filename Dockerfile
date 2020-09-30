FROM node
RUN apt-get update && apt-get install -y qemu-system-x86 python python-setuptools git
RUN git clone https://github.com/novnc/websockify.git
RUN cd websockify && python setup.py install
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 8443
EXPOSE 8080
CMD [ "npm", "start" ]
