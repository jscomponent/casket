# Casket CMS

> Casket Content Management System - Built on [feathers](https://feathersjs.com) using MongoDB with Mongoose 🔥

## Motivation

Imagin having an autoscaling real-time server up and running in no time with no limitations, all for free 😵‍💫
In the future perhaps a replacement for firebase, strapi and other commercial services without hidden fees ..

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
- [ ] Media upload
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
