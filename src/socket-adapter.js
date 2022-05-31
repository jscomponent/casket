import { createAdapter } from '@socket.io/mongo-adapter'

export default async (io, app) => {
  let mongoClient = app.get('mongooseClient').connection.client
  const mongoCollection = mongoClient.db().collection('socket.io-adapter-events')
  await mongoCollection.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600, background: true }
  )
  io.adapter(createAdapter(mongoCollection, { addCreatedAtField: true }))
}