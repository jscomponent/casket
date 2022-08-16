import * as feathersAuthentication from '@feathersjs/authentication'
import * as local from '@feathersjs/authentication-local'
import * as cmn from 'feathers-hooks-common'
import checkPermissions from 'feathers-permissions'
import { setField } from 'feathers-authentication-hooks'

const { authenticate } = feathersAuthentication.hooks
const { hashPassword, protect } = local.hooks
const { iff } = cmn.default

let permissions = [
  checkPermissions({
    roles: ['admin'],
    error: false
  }),
  iff(ctx => !ctx.params.permitted,
    setField({
      from: 'params.user._id',
      as: 'params.query._id',
      allowUndefined: false
    })
  )
]

let restrictAdminRole = async ctx => {
  if (!ctx.params.provider) return ctx // server has no restrictions
  if (ctx.data.permissions && !ctx.params?.user?.permissions?.includes('admin')) {
    ctx.data.permissions = ctx.data.permissions.filter(role => role !== 'admin')
  }
  return ctx
}

let ensureUserRole = async ctx => {
  if (!ctx.params.provider) return ctx // server has no restrictions
  if (!ctx.data.permissions) ctx.data.permissions = []
  if (!ctx.data.permissions.includes('user')) ctx.data.permissions.push('user')
  return ctx
}

export default {
  before: {
    all: [],
    find: [ authenticate('jwt'), ...permissions ],
    get: [ authenticate('jwt'), ...permissions ],
    create: [ hashPassword('password'), restrictAdminRole, ensureUserRole ],
    update: [ hashPassword('password'), authenticate('jwt'), ...permissions, restrictAdminRole, ensureUserRole ],
    patch: [ hashPassword('password'), authenticate('jwt'), ...permissions, restrictAdminRole, ensureUserRole ],
    remove: [ authenticate('jwt'), ...permissions ]
  },

  after: {
    all: [ protect('password') ],
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
