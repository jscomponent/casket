export default app => {
  const modelName = 'types/any'
  const mongooseClient = app.get('mongooseClient')
  const schema = new mongooseClient.Schema(
    {
      title: { type: String },
      slug: { type: String, unique: true, lowercase: true },
      status: { type: String }, // published, draft
      fields: { type: Object },
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
  return mongooseClient.model(modelName, schema)
}
