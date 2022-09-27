import { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'

export default app => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('anonymous', new AnonymousStrategy())
  authentication.register('google', new GoogleStrategy())

  app.use('/authentication', authentication)
  app.configure(oauth())
}

class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    return { anonymous: true }
  }
}

class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    // this will set 'googleId'
    const base = await super.getEntityData(profile)

    // this will grab the picture and email address of the Google profile
    return {
      ...base,
      profilePicture: profile.picture,
      email: profile.email
    }
  }
}