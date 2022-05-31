import 'dotenv/config'
import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import helmet from 'helmet'
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

const app = express(feathers())

app.configure(configuration())
app.set('mongodb', process.env.mongodb)

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.svg')))
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
  try {
    res.sendFile(app.get('public') + '/index.html')
  } catch (error) {
    res.json({ success: false, message: 'Something went wrong' })
  }
})
//app.use(express.notFound())
app.use(express.errorHandler({ logger }))

app.hooks(appHooks)

export default app