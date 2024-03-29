export default app => {
  const modelName = 'users'
  const mongooseClient = app.get('mongooseClient')
  const schema = new mongooseClient.Schema(
    {
      name: { type: String },
      email: { type: String, lowercase: true, index: true, unique: true, sparse: true },
      email_verified: { type: Boolean, default: false },
      password: { type: String, required: true, minLength: 6 },
      locale: { type: String },
      owner_group: { type: String },
      permissions: { type: Array, default: ['user'] },
      picture: { type: String },
      googleId: { type: String, trim: true, index: true, unique: true, sparse: true },
      facebookId: { type: String, trim: true, index: true, unique: true, sparse: true },
      githubId: { type: String, trim: true, index: true, unique: true, sparse: true },
      meta: { type: Object }
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
