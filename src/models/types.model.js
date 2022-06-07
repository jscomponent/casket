import mongooseIntl from 'mongoose-intl'
export default app => {
  const modelName = 'types/any'
  const mongooseClient = app.get('mongooseClient')
  const schema = new mongooseClient.Schema(
    {
      title: { type: String, intl: true },
      slug: { type: String, unique: true, lowercase: true },
      status: { type: String }, // published, draft
      fields: { type: Object },
      instance: { type: Buffer },
      roles: { type: Object },
      owner: { type: String }
    },
    {
      timestamps: true,
      collection: modelName
    }
  )
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  schema.plugin(mongooseIntl, {
    languages: process.env.lang.split(',').map(l => l.trim()),
    defaultLanguage: 'en'
  })
  return mongooseClient.model(modelName, schema)
}
