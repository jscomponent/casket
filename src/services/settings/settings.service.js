import { Settings } from './settings.class.js'
import hooks from './settings.hooks.js'

export default app => {
  const options = {}
  app.use('/settings', new Settings(options, app))
  const service = app.service('settings')
  service.hooks(hooks)
}
