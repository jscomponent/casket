import register from '../../register-type.js'
import pkg from 'feathers-mongoose'
const { Service } = pkg

export class Types extends Service {
  
  async get(id, params) {
    let results = await super.get(id, params)
    results.instance = results.instance.buffer
    results._id = results._id.toString()
    return results
  }

  async find(params) {
    let results = await super.find(params)
    results.data = results.data.map(d => {
      if (d.instance) d.instance = d.instance.buffer
      d._id = d._id.toString()
      return d
    })
    return results
  }
  
  async create(data, params) {
    if (!data.roles || Object.keys(data.roles).length === 0) {
      data.roles = {
        find: ['anonymous'],
        get: ['anonymous'],
        create: ['admin'],
        update: ['admin'],
        patch: ['admin'],
        remove: ['admin']
      }
    }
    if (!data.owner) data.owner = '_id'
    let results = await super.create(data, params)
    await register(this.app, results)
    return results
  }

  async update(id, data, params) {
    let old = await this.get(id)
    let results = await super.update(id, data, params)
    await register(this.app, results)
    if (results.slug) {
      let mongoClient = this.app.get('mongooseClient').connection.client
      mongoClient.db().collection('types/' + old.slug).rename('types/' + results.slug)
    }
    return results
  }

  async patch(id, data, params) {
    let old = await this.get(id)
    let results = await super.patch(id, data, params)
    if (results.slug) {
      let mongoClient = this.app.get('mongooseClient').connection.client
      mongoClient.db().collection('types/' + old.slug).rename('types/' + results.slug)
    }
    await register(this.app, results)
    return results
  }

  async remove(id, params) {
    let results = await super.remove(id, params)
    let mongoClient = this.app.get('mongooseClient').connection.client
    mongoClient.db().dropCollection('types/' + results.slug)
    return results
  }

  async setup(app, path) {
    this.app = app
    this.path = path
  }
}
