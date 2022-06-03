import register from './register-type.js'

export default async app => {
  let mongoClient = app.get('mongooseClient').connection.client
  let collection = mongoClient.db().collection('types/any')
  let types = await collection.find().limit(100)
  let arr = await types.toArray()
  arr.forEach(async type => await register(app, type))
  for await (const type of arr) {
    await register(app, type)
  }
}