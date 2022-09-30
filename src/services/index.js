import users from './users/users.service.js'
import types from './types/types.service.js'
export default async app => {
  if (app.lookup('/users')) await app.unuse('/users')
  if (app.lookup('/types/any')) await app.unuse('/types/any')
  app.configure(users)
  app.configure(types)
}
