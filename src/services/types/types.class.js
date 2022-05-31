import register from '../../register-type.js'
import pkg from 'feathers-mongoose'
const { Service } = pkg

export class Types extends Service {

  async create(data, params) {
    if (!data.roles || Object.keys(data.roles).length === 0) {
      data.roles = {
        all: [],
        find: [],
        get: [],
        create: ['auth', 'admin'],
        update: ['auth', 'admin'],
        patch: ['auth', 'admin'],
        remove: ['auth', 'admin']
      }
    }
    if (!data.owner) data.owner = '_id'
    let results = await super.create(data, params)
    await register(this.app, results)
    return results
  }

  async update(data, params) {
    let results = await super.update(data, params)
    await register(this.app, results)
    return results
  }

  async patch(data, params) {
    let results = await super.patch(data, params)
    await register(this.app, results)
    return results
  }

  async remove(id, params) {
    let results = await super.remove(id, params)
    let mongoClient = this.app.get('mongooseClient').connection.client
    mongoClient.db().dropCollection('types/' + results.slug)
    return results
  }

  setup(app, path) {
    this.app = app
    this.path = path
  }
}
