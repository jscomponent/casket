export default app => {
  const modelName = 'users'
  const mongooseClient = app.get('mongooseClient')
  const schema = new mongooseClient.Schema(
    {
      email: { type: String, unique: true, lowercase: true },
      password: { type: String },
      locale: { type: String },
      owner_group: { type: String },
      permissions: { type: Array },
      picture: { type: String },
      googleId: { type: String, unique: true },
      facebookId: { type: String, unique: true },
      githubId: { type: String, unique: true }
    },
    {
      timestamps: true
    }
  )
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  return mongooseClient.model(modelName, schema)
}
