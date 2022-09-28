import pkg from 'feathers-mongoose'
const { Service } = pkg

export class Types extends Service {
  
  async get(id, params) {
    let results = await super.get(id, params)
    results.instance = results.instance?.buffer
    results.dashboard = results.dashboard?.buffer
    results._id = results._id.toString()
    return results
  }

  async find(params) {
    let results = await super.find(params)
    results.data = results.data.map(d => {
      if (d.instance) d.instance = d.instance?.buffer
      if (d.dashboard) d.dashboard = d.dashboard?.buffer
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
    if (!data.owner_group) data.owner_group = 'user_id'
    let results = await super.create(data, params)
    if (results.instance) results.instance = results.instance?.buffer
    if (results.dashboard) results.dashboard = results.dashboard?.buffer
    return results
  }

  async update(id, data, params) {
    let old = await this.get(id)
    let results = await super.update(id, data, params)
    if (results.slug && old.slug !== results.slug) {
      let mongoClient = this.app.get('mongooseClient').connection.client
      await mongoClient.db().collection('types/' + old.slug).rename('types/' + results.slug)
    }
    if (results.instance) results.instance = results.instance?.buffer
    if (results.dashboard) results.dashboard = results.dashboard?.buffer
    return results
  }

  async patch(id, data, params) {
    let old = await this.get(id)
    let results = await super.patch(id, data, params)
    if (results.slug && old.slug !== results.slug) {
      let mongoClient = this.app.get('mongooseClient').connection.client
      await mongoClient.db().collection('types/' + old.slug).rename('types/' + results.slug)
    }
    if (results.instance) results.instance = results.instance?.buffer
    if (results.dashboard) results.dashboard = results.dashboard?.buffer
    return results
  }

  async remove(id, params) {
    let results = await super.remove(id, params)
    let mongoClient = this.app.get('mongooseClient').connection.client
    await mongoClient.db().dropCollection('types/' + results.slug)
    return results
  }

  async setup(app) {
    this.app = app
  }
}
