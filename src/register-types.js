import register from './register-type.js'

export default async app => {
  let mongoClient = app.get('mongooseClient').connection.client
  let collection = mongoClient.db().collection('types/any')
  let types = await collection.find().limit(100)
  let arr = await types.toArray()
  for await (const type of arr) await register(app, type)
}