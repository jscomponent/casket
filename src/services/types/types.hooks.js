import { authenticate } from '@feathersjs/authentication'
import checkPermissions from 'feathers-permissions'

let permissions = [
  checkPermissions({
    roles: ['admin']
  })
]

export default {
  before: {
    all: [authenticate('jwt'), ...permissions],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
