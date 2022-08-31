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
import socketio from '@feathersjs/socketio'
import middleware from './middleware/index.js'
import appHooks from './app.hooks.js'
import mongoose from './mongoose.js'
import settings from './services/settings/settings.service.js'
import letsencrypt from './letsencrypt.js'

const app = express(feathers())

app.configure(configuration())
app.set('mongodb', process.env.mongodb)
app.set('etag', false)
app.set('letsencrypt', letsencrypt)
app.set('tar', tar)

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
  app.configure(socketio())
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
