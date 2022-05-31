import { Types } from './types.class.js'
import createModel from '../../models/types.model.js'
import hooks from './types.hooks.js'

export default app => {
  const options = {
    whitelist: [ '$regex', '$search' ],
    Model: createModel(app),
    paginate: app.get('paginate')
  }
  app.use('/types/any', new Types(options, app))
  const service = app.service('types/any')
  service.hooks(hooks)
}
