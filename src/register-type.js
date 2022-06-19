import pkg from 'feathers-mongoose'
import mongooseIntl from 'mongoose-intl'
const { Service } = pkg
import * as feathersAuthentication from '@feathersjs/authentication'
import * as cmn from 'feathers-hooks-common'
import checkPermissions from 'feathers-permissions'
import { setField } from 'feathers-authentication-hooks'

const { authenticate } = feathersAuthentication.hooks
const { iff } = cmn.default

export default async (app, type) => {
  const options = {
    whitelist: [ '$regex', '$search' ],
    Model: createModel(app, type),
    paginate: app.get('paginate')
  }
  let instance = type.instance.toString('base64')
  try {
    let service = app.service('/types/' + type.slug)
    if (instance) {
      try {
        const { Entity } = await import(`data:text/javascript;base64,${instance}`)
        service.assign(new Entity())
      } catch(e) {
        console.log(e)
        service.assign(new TypeClean())
      }
    } else {
      service.assign(new TypeClean())
    }
    let currentSchema = service?.Model?.schema?.obj
    if (currentSchema && typeof currentSchema === 'object') {
      Object.keys(currentSchema).forEach(key => {
        service.Model.schema.remove(key)
      })
    }
    if (type.fields && typeof type.fields === 'object') {
      Object.keys(type.fields).forEach(k => delete type.fields[k].title)
      service.Model.schema.add(type.fields)
    }
    service.Model.schema.plugin(mongooseIntl, {
      languages: process.env.lang.split(',').map(l => l.trim()),
      defaultLanguage: 'en'
    })
    return
  } catch(e) {

    app.use('/types/' + type.slug, new Type(options, app))
    const service = app.service('types/' + type.slug)
    service.hooks(hooks(type))
    if (instance) {
      try {
        const { Entity } = await import(`data:text/javascript;base64,${instance}`)
        service.assign(new Entity())
      } catch(e) {
        console.log(e)
      }
    }
  }
}

let createModel = (app, type) => {
  const modelName = 'types/' + type.slug
  const mongooseClient = app.get('mongooseClient')
  if (type.fields && typeof type.fields === 'object') {
    Object.keys(type.fields).forEach(k => delete type.fields[k].title)
  }
  const schema = new mongooseClient.Schema(type.fields, {
    timestamps: true,
    collection: modelName
  })
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName)
  }
  schema.plugin(mongooseIntl, {
    languages: process.env.lang.split(',').map(l => l.trim()),
    defaultLanguage: 'en'
  })
  return mongooseClient.model(modelName, schema)
}

let permissions = (type, method) => {
  return [
    async ctx => {
      const { params } = ctx
      let results = await ctx.app.service('types/any').find({ query: { slug: type.slug } })
      ctx.params.typeRoles = results.data[0]?.roles[method] || []
      if (params.provider && ctx.params.typeRoles.includes('anonymous')) {
        ctx.params = {
          ...params,
          authentication: { strategy: 'anonymous' }
        }
      }
      return ctx
    },
    authenticate('jwt', 'anonymous'),
    checkPermissions({
      roles: async ctx => {
        if (ctx.params.anonymous) {
          ctx.params.user = {}
          ctx.params.permitted = true
          return ['*']
        }
        return ctx.params.typeRoles
      },
      error: false
    }),
    iff(ctx => !ctx.params.permitted,
      setField({
        from: 'params.user.' + (type.owner || '_id'),
        as: 'params.query._id',
        allowUndefined: false
      })
    ),
    iff(ctx => !ctx.params.permitted,
      setField({
        from: 'params.user.' + (type.owner || '_id'),
        as: 'params.query.user_id',
        allowUndefined: false
      })
    )
  ]
}

let hooks = type => {

  return {
    before: {
      find: [ ...permissions(type, 'find') ],
      get: [ ...permissions(type, 'get') ],
      create: [ ...permissions(type, 'create') ],
      update: [ ...permissions(type, 'update') ],
      patch: [ ...permissions(type, 'patch') ],
      remove: [ ...permissions(type, 'remove') ]
    },

    after: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    },

    error: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    }
  }
}

class Type extends Service {

  assign(object) {
    if (object.get) { this.mapGet = object.get } else { this.mapGet = (...args) => super.get(...args) }
    if (object.find) { this.mapFind = object.find } else { this.mapFind = (...args) => super.find(...args) }
    if (object.create) { this.mapCreate = object.create } else { this.mapCreate = (...args) => super.create(...args) }
    if (object.update) { this.mapUpdate = object.update } else { this.mapUpdate = (...args) => super.update(...args) }
    if (object.patch) { this.mapPatch = object.patch } else { this.mapPatch = (...args) => super.patch(...args) }
    if (object.remove) { this.mapRemove = object.remove } else { this.mapRemove = (...args) => super.remove(...args) }
  }

  setup(app, path) {
    let scope = this
    this.app = app
    this.path = path
    this.parent = {
      async get(...args) { return scope.parentGet(...args) },
      async find(...args) { return scope.parentFind(...args) },
      async create(...args) { return scope.parentCreate(...args) },
      async update(...args) { return scope.parentUpdate(...args) },
      async patch(...args) { return scope.parentPatch(...args) },
      async remove(...args) { return scope.parentRemove(...args) }
    }
  }

  async get(...args) { return this.mapGet(...args) }
  async find(...args) { return this.mapFind(...args) }
  async create(...args) { return this.mapCreate(...args) }
  async update(...args) { return this.mapUpdate(...args) }
  async patch(...args) { return this.mapPatch(...args) }
  async remove(...args) { return this.mapRemove(...args) }

  async mapGet(...args) { return super.get(...args) }
  async mapFind(...args) { return super.find(...args) }
  async mapCreate(...args) { return super.create(...args) }
  async mapUpdate(...args) { return super.update(...args) }
  async mapPatch(...args) { return super.patch(...args) }
  async mapRemove(...args) { return super.remove(...args) }

  async parentGet(...args) { return super.get(...args) }
  async parentFind(...args) { return super.find(...args) }
  async parentCreate(...args) { return super.create(...args) }
  async parentUpdate(...args) { return super.update(...args) }
  async parentPatch(...args) { return super.patch(...args) }
  async parentRemove(...args) { return super.remove(...args) }
  
}

class TypeClean {

  async get(...args) { return this.parent.get(...args) }
  async find(...args) { return this.parent.find(...args) }
  async create(...args) { return this.parent.create(...args) }
  async update(...args) { return this.parent.update(...args) }
  async patch(...args) { return this.parent.patch(...args) }
  async remove(...args) { return this.parent.remove(...args) }

}