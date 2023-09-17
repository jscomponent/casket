# Casket CMS

```bash
systemctl enable docker
```

> Casket Content Management System - Built on [FeathersJS](https://feathersjs.com) using [MongoDB](https://mongodb.com) with [Mongoose](https://mongoosejs.com) and [Socket.IO](https://socket.io) 🔥

## Deploy on Google Cloud Run

1. Fork this project
2. 

## Getting Started

🆘 This project is currently in an early state 🛰

1. Make sure you have git, [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install pm2

    ```
    npm i -g pm2
    ```
    
3. Clone this repo and update your host url

    ```
    git clone https://github.com/vueux/casket .
    nano .env # host = https://example.com
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
- [x] Support extending class for dynamic services
- [x] Graphical design
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
