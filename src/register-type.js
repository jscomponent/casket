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
    Object.assign(service.__hooks, { before: {}, after: {}, error: {} })
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
    service.hooks(hooks(type))
    Object.keys(service.Model.schema.obj).forEach(key => {
      service.Model.schema.remove(key)
    })
    service.Model.schema.add(type.fields)
    service.Model.schema.plugin(mongooseIntl, {
      languages: process.env.lang.split(',').map(l => l.trim()),
      defaultLanguage: 'en'
    })
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
  const schema = new mongooseClient.Schema(type.fields,
    { timestamps: true, collection: modelName }
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

let permissions = (roles, ownerField = '_id') => {
  let permissions = []
  if (!roles.length) return permissions
  if (roles.includes('auth')) {
    roles = roles.filter(r => r === 'auth')
    permissions.push(authenticate('jwt'))
  }
  if (!roles.length) return permissions
  permissions.push(
    checkPermissions({
      roles: roles,
      error: false
    })
  )
  permissions.push(
    iff(ctx => !ctx.params.permitted,
      setField({
        from: 'params.user.' + ownerField,
        as: 'params.query.owner_id',
        allowUndefined: false
      })
    )
  )
  return permissions
}

let hooks = type => {

  return {
    before: {
      all: [ ...permissions(type?.roles?.all || [], type.owner || '_id') ],
      find: [ ...permissions(type?.roles?.find || [], type.owner || '_id') ],
      get: [ ...permissions(type?.roles?.get || [], type.owner || '_id') ],
      create: [ ...permissions(type?.roles?.create || [], type.owner || '_id') ],
      update: [ ...permissions(type?.roles?.update || [], type.owner || '_id') ],
      patch: [ ...permissions(type?.roles?.patch || [], type.owner || '_id') ],
      remove: [ ...permissions(type?.roles?.remove || [], type.owner || '_id') ]
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