export default {
  before: {
    all: [],
    find: [
      ctx => {
        let query = ctx.params.query
        for (let field in query) {
          if (query[field].$search && field.indexOf('$') == -1) {
            query[field] = { $regex: new RegExp(query[field].$search, 'i') }
          } else if (typeof query[field].$search !== 'undefined') {
            delete query[field]
          }
        }
        ctx.params.query = query
        return ctx
      }
    ],
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
