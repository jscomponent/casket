import pkg from 'feathers-mongoose'
import mongooseIntl from 'mongoose-intl'
const { Service } = pkg
import { authenticate } from '@feathersjs/authentication'
import { iff } from 'feathers-hooks-common'
import { setField } from 'feathers-authentication-hooks'
import checkPermissions from 'feathers-permissions'

export default async (app, type) => {
  if (app.lookup('/types/' + type.slug)) await app.unuse('/types/' + type.slug)
  let options = {whitelist: [ '$regex', '$search', '$options', '$where', '$function', '$expr' ], Model: createModel(app, type), paginate: app.get('paginate')}
  let service = new Service(options, app)
  let instance = type.instance.toString().trim()
  if (instance) {
    try {
      instance = instance.replace('export class Entity', 'export default Service => class Entity extends Service')
      instance = Buffer.from(instance).toString('base64')
      const Method = await import(`data:text/javascript;base64,${instance}`)
      const Entity = Method.default(Service)
      service = new Entity(options, app)
    } catch(e) {
      console.log(e)
    }
  }
  app.use('/types/' + type.slug, service, (req, res, next) => {
    res.set('Cache-Control', 'no-store')
    let customHeaders = res?.data?.headers || {}
    let customDisposition = false
    for (const key of Object.keys(customHeaders)) {
      if (key.toLocaleLowerCase() === 'content-disposition') customDisposition = true
      res.set(key, res?.data?.headers[key])
    }
    if (res?.data.status && res?.data.redirect) {
      res.redirect(res?.data.status, res?.data.redirect)
    } else if (res?.data.redirect) {
      res.redirect(res?.data.redirect)
    } else {
      if (res?.data?.buffer && res?.data?.filename) {
        if (!customDisposition) res.set('Content-Disposition', `attachment; filename="${res?.data?.filename}"`)
        res.type(res.data.filename.split('.').pop())
        res.send(res.data.buffer)
      } else if (res?.data?.buffer && res?.data['content-type']) {
        res.set('Content-Type', res.data['content-type'])
        res.send(res.data.buffer)
      } else if (res?.data?.buffer) {
        res.set('Content-Type', res.data['content-type'])
        res.send(res.data.buffer)
      } else {
        next()
      }
    }
  })
  service = app.service('types/' + type.slug)
  service.hooks(hooks(type))
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
    languages: process.env?.lang?.split(',')?.map(l => l.trim()) || ['en'],
    defaultLanguage: 'en'
  })
  return mongooseClient.model(modelName, schema)
}

let permissions = (type, method) => {
  return [
    async ctx => {
      const { params, app } = ctx
      let results = await app.service('types/any').find({ query: { slug: type.slug } })
      params.typeRoles = results?.data?.[0]?.roles[method] || []
      if (params.typeRoles.includes('anonymous')) {
        for (const role of params?.user?.permissions || []) {
          // On anonymous, allow all roles of user to see content if logged in
          if (!params.typeRoles.includes(role)) params.typeRoles.push(role)
        }
        if (params?.provider && !params?.authentication?.strategy) params.authentication = { strategy: 'anonymous' }
      }
      ctx.params = params
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
        as: 'params.query.' + (type.owner_group || 'user_id')
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