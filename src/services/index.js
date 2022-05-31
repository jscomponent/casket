import users from './users/users.service.js'
import types from './types/types.service.js'
export default app => {
  app.configure(users)
  app.configure(types)
}
