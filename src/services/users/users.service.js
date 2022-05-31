import { Users } from './users.class.js'
import createModel from '../../models/users.model.js'
import hooks from './users.hooks.js'

export default app => {
  const options = {
    whitelist: [ '$regex', '$search' ],
    Model: createModel(app),
    paginate: app.get('paginate')
  }
  app.use('/users', new Users(options, app))
  const service = app.service('users')
  service.hooks(hooks)
}
