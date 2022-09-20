import { authenticate } from '@feathersjs/authentication'
import checkPermissions from 'feathers-permissions'

let permissions = [
  checkPermissions({
    roles: ['admin']
  })
]

export default {
  before: {
    all: [],
    find: [ authenticate('jwt'), ...permissions ],
    get: [],
    create: [],
    update: [ authenticate('jwt'), ...permissions ],
    patch: [ authenticate('jwt'), ...permissions ],
    remove: [ authenticate('jwt'), ...permissions ]
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
