import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import helmet from 'helmet'
import tar from 'tar-fs'
import cors from 'cors'
import logger from './logger.js'
import feathers from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express from '@feathersjs/express'
import session from 'cookie-session'
import socketio from '@feathersjs/socketio'
import sync from 'feathers-sync'
import middleware from './middleware/index.js'
import appHooks from './app.hooks.js'
import mongoose from './mongoose.js'
import settings from './services/settings/settings.service.js'
import letsencrypt from './letsencrypt.js'
import { randomUUID } from 'crypto'

const app = express(feathers())

app.configure(sync({ uri: process.env.redis || 'redis://localhost:6379' }))

app.configure(configuration())
app.set('mongodb', process.env.mongodb)
app.set('etag', false)
app.set('letsencrypt', letsencrypt)
app.set('tar', tar)

app.use(session({
  genid() {
    return randomUUID() // so redis does not conflict
  },
  secret: 'feathers',
  resave: true,
  saveUninitialized: true
}))
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.header('Cross-Origin-Embedder-Policy', 'cross-origin')
  res.header('Cross-Origin-Opener-Policy', 'cross-origin')
  res.header('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
})
app.use(favicon(path.resolve('./admin/favicon.svg')))
app.use('/', express.static(app.get('public')))

app.configure(express.rest())

if (app.get('mongodb')) {
  app.configure(mongoose)
  app.configure(middleware)
} else {
  app.configure(socketio({
    maxHttpBufferSize: 1e9, // def 1e6
    pingTimeout: 60000 // def 20000
  }))
}

app.configure(settings)

app.get('*', (req, res) => {
  let p = path.resolve('./admin/index.html')
  try {
    res.sendFile(p)
  } catch (error) {
    res.json({ success: false, message: 'Something went wrong', path: p })
  }
})
//app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

export default app
