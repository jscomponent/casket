import socketio from '@feathersjs/socketio'
import adapter from '../socket-adapter.js'
import registerTypes from '../register-types.js'
import services from '../services/index.js'
import channels from '../channels.js'
import authentication from '../authentication.js'

export default app => {
  if (!app.io) app.configure(socketio(io => adapter(io, app)))
  app.configure(services)
  app.configure(authentication)
  app.configure(channels)
  registerTypes(app)
}
