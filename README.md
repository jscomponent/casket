# Casket CMS

```bash
systemctl enable docker
```

> Casket Content Management System - Built on [FeathersJS](https://feathersjs.com) using [MongoDB](https://mongodb.com) with [Mongoose](https://mongoosejs.com) and [Socket.IO](https://socket.io) 🔥

## Environment variables

```bash
NODE_ENV = production # or development
lang = en, no # de, dk, etc...
port = 80 # On which port the app should run (should be unique to proxyport, usually 80 if webmaster is false and 8000 if webmaster is true)
PORT = 90 ## overrides port
$PORT = 900 ## overrides PORT
proxyport = 80 # On which port the app runs on 
proxyportssl = 80
host = localhost # IP or Hostname where you will access service on the internet. Is this still in use?
mongodb = mongodb://root:example@mongo:27017/casket?authSource=admin # Add connection string
redis = redis://redis:6379 # If you are running on a cluster, add redis for shared memory
webmaster = true # Set to true if you are deploying using docker-compose (npm run build)
autobackup = true # Set to false on ephemeral runners
```

## Deploy on Google Cloud Run

1. Fork this project
2. Set the following env variables:

```bash
NODE_ENV = production
lang = en, no
mongodb = # Your Connection String
```

3. Deploy

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
