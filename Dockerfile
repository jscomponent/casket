# Each instruction in this file creates a new layer
# Here we are getting our node as Base image
FROM node:latest
# Creating a new directory for app files and setting path in the container
RUN mkdir -p /usr/casket
# setting working directory in the container
WORKDIR /usr/casket
# copying the package.json file(contains dependencies) from project source dir to container dir
COPY package.json /usr/casket
# installing the dependencies into the container
RUN npm i
RUN npm i vite -g
RUN npm i pm2 -g
RUN npm i pnpm -g
RUN npm i yarn -g
RUN npm i forever -g
# install text editors
RUN apt-get -y update
RUN apt-get -y install vim nano
# copying the source code of Application into the container dir
COPY . /usr/casket
RUN rm -f /usr/casket/.env
RUN mv /usr/casket/.env.docker /usr/casket/.env
# container exposed network port number
EXPOSE 80 443
# command to run within the container
CMD ["pm2-runtime", "src/index.js"]