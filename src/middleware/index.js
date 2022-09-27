import socketio from '@feathersjs/socketio'
import adapter from '../socket-adapter.js'
import registerTypes from '../register-types.js'
import services from '../services/index.js'
import channels from '../channels.js'
import authentication from '../authentication.js'
import mongodb from 'mongodb'

export default app => {
  let db = app.get('mongooseClient').connection.client.db()
  app.set('bucket', new mongodb.GridFSBucket(db, { bucketName: 'uploads' }))
  if (!app.io) app.configure(socketio({
    maxHttpBufferSize: 1e9, // def 1e6
    pingTimeout: 60000 // def 20000
  },io => adapter(io, app)))
  app.configure(services)
  app.set('authconf', authentication)
  app.configure(authentication)
  app.configure(channels)
  registerTypes(app)
}
