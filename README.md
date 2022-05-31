# Casket CMS

> Casket Content Management System - Built on [FeathersJS](https://feathersjs.com) using [MongoDB](https://mongodb.com) with [Mongoose](https://mongoosejs.com) and [Socket.IO](https://socket.io) 🔥

## Motivation

PHP just can't take up the fight against NodeJS anymore, as realtime libraries and other awesome NodeJS packages are spreading around on the internet.
And coming from a world where WordPress & Laravel have been there for decades, NodeJS is struggling to fill this holes.
Imagin having an auto scaled real-time CMS up and running in no time with no limitations, all for free written in NodeJS without writing any code. 😵‍💫💥

In the future perhaps a replacement for systems such as firebase, strapi & WordPress?

Where not there yet, but it is surely the right time to get started. 💪🏽

## Getting Started

🆘 Warning! - This project is currently in an experimental state 🛰

1. Make sure you have git, [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install pm2

    ```
    npm i -g pm2
    ```
    
3. Clone this repo and update your host url

    ```
    git clone https://github.com/vueux/casket .
    nano config/default # replace host with your ip or website domain
    ```
    
4. Install dependencies and run server

    ```
    npm run start
    ```
    
5. Go to your host url in a browser to start the installation process!

## Roadmap

- [x] Rest API (Comes with feathers)
- [x] Socket API (Comes with feathers)
- [x] User authentication (Comes with feathers)
- [x] Roles management (Comes with feathers)
- [x] Dynamic services (Stored in database)
- [x] Stateless (Using MongoDB adapter for socket connections and uploads in the future)
- [x] Clustering (Run on multiple cores)
- [x] Zero downtime (Using pm2 with combination of dynamic services)
- [ ] Graphical design
- [ ] Media upload (use munter?)
- [ ] Documentation

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).
