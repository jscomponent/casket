import { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'
import axios from 'axios'

export default app => {
  const authentication = new AuthenticationService(app)

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('anonymous', new AnonymousStrategy())
  authentication.register('google', new GoogleStrategy())
  authentication.register('facebook', new FacebookStrategy())
  authentication.register('github', new GithubStrategy())

  app.set('oauth', oauth)

  app.use('/authentication', authentication)
  app.configure(oauth())
}

class AnonymousStrategy extends AuthenticationBaseStrategy {
  async authenticate(authentication, params) {
    return { anonymous: true }
  }
}

class GithubStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile)
    return {
      ...baseData,
      name: profile.login,
      avatar: profile.avatar_url,
      email: profile.email
    }
  }
}

class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile) {
    const base = await super.getEntityData(profile)
    return {
      ...base,
      profilePicture: profile.picture,
      email: profile.email
    }
  }
}

class FacebookStrategy extends OAuthStrategy {
  async getProfile (authResult) {
    const accessToken = authResult.access_token
    const { data } = await axios.get('https://graph.facebook.com/me', {
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      params: {
        fields: 'id,name,email,picture'
      }
    })
    return data
  }
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile)
    return {
      ...baseData,
      name:  profile.name,
      email: profile.email
    }
  }
}