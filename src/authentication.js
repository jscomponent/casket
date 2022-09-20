import { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth } from '@feathersjs/authentication-oauth'

export default app => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('anonymous', new AnonymousStrategy())

  app.use('/authentication', authentication)
  app.configure(oauth())
}

class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    return { anonymous: true }
  }
}