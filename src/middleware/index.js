import socketio from '@feathersjs/socketio'
import adapter from '../socket-adapter.js'
import registerTypes from '../register-types.js'
import services from '../services/index.js'
import channels from '../channels.js'
import authentication from '../authentication.js'
import mongodb from 'mongodb'

export default app => {
  let db = this.app.get('mongooseClient').connection.client.db()
  app.set('bucket', new mongodb.GridFSBucket(db, { bucketName: 'uploads' }))
  if (!app.io) app.configure(socketio(io => adapter(io, app)))
  app.configure(services)
  app.configure(authentication)
  app.configure(channels)
  registerTypes(app)
}
