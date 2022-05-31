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
  app.use('/types/' + type.slug, new Type(options, app))
  const service = app.service('types/' + type.slug)
  service.hooks(hooks(type))
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
  
}