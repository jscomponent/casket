FROM node:20.2.0

RUN mkdir -p /usr/casket
WORKDIR /usr/casket

COPY . /usr/casket

RUN rm -f /usr/casket/.env
RUN touch /usr/casket/.env.docker
RUN mv /usr/casket/.env.docker /usr/casket/.env

RUN npm i
RUN npm i vite -g
RUN npm i pm2 -g
RUN npm i pnpm -g
RUN npm i forever -g

RUN apt-get -y update
RUN apt-get -y install vim nano

EXPOSE 80 443

CMD ["pm2-runtime", "src/index.js"]
