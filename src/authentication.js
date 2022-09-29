import { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'
import axios from 'axios'
import crypto from 'crypto'

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

class OAuthAutoRegisterStrategy extends OAuthStrategy {
  async findEntity(profile, params) {
    let entity = await super.findEntity(profile, params)
    if (!entity && profile.email) {
      profile.password = crypto.randomBytes(12).toString('hex')
      return super.createEntity(profile, params)
    }
    return entity
  }
}

class GithubStrategy extends OAuthAutoRegisterStrategy {
  async getProfile (authResult) {
    const accessToken = authResult.access_token
    let user = await axios.get('https://api.github.com/user', {
      headers: {
        authorization: `Bearer ${accessToken}`
      }
    })
    if (!user?.data?.email) {
      let emails = await axios.get('https://api.github.com/user/emails', {
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
      if (emails.data.length) user.data.email =  emails.data[0]?.email
    }
    return user.data
  }
  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile)
    return {
      ...baseData,
      name:  profile.name,
      email: profile.email,
      picture: profile.avatar_url
    }
  }
}

class GoogleStrategy extends OAuthAutoRegisterStrategy {
  async getEntityData(profile) {
    const base = await super.getEntityData(profile)
    return {
      ...base,
      name: profile.name,
      email: profile.email,
      picture: profile.picture
    }
  }
}

class FacebookStrategy extends OAuthAutoRegisterStrategy {
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
      email: profile.email,
      picture: profile.picture?.data?.url
    }
  }
}