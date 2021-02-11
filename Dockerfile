FROM debian
RUN apt-get update && apt-get install -y qemu-system-x86 python3-setuptools git curl
RUN curl -sL https://deb.nodesource.com/setup_lts.x | bash - && apt-get install -y nodejs
RUN git clone https://github.com/novnc/websockify.git && cd websockify && python3 setup.py install
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY src src
COPY keys.json .
RUN npm run build
RUN rm -r src
CMD [ "npm", "start" ]
COPY public public
