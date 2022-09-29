import { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'
import axios from 'axios'
import crypto from 'crypto'

export default app => {
  const authentication = new AuthenticationService(app)

  class AnonymousStrategy extends AuthenticationBaseStrategy {
    async authenticate(authentication, params) {
      return { anonymous: true }
    }
  }
  
  class OAuthAutoRegisterStrategy extends OAuthStrategy {
    async findEntity(profile, params) {
      let entity = await super.findEntity(profile, params)
      console.log('found entity?', entity)
      console.log('params', params)
      if (!entity) {
        return super.createEntity(profile, params)
        /*
        try {
          return this.createEntity(profile, params)
        } catch(e) {
          return super.createEntity(profile, params)
        }
        */
      }
      return entity
    }
    async getRedirect(data) {
      console.log('get redir', data)
      let results = await super.getRedirect(data)
      console.log('redir', results)
      return results
    }/*
    async createEntity(profile) {
      console.log('creating new entity')
      let user = {
        name: profile.name,
        picture: profile.picture,
        email: profile.email,
        email_verified: profile.email_verified,
        locale: profile.locale,
        password: crypto.randomBytes(12).toString('hex'),
        permissions: ['user']
      }
      user[this.name + 'Id'] = profile.sub || profile.id
      return app.service('/users').create(user)
    }*/
    async updateEntity(profile, params) {
      let results = await super.updateEntity(profile, params)
      console.log('updateEntity', results)
      return results
    }
    async authenticate(authentication, params) {
      let results = await super.authenticate(authentication, params)
      console.log('authenticate', results)
      return results
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
      console.log('got profile')
      console.log(profile)
      console.log('getting entity data')
      const base = await super.getEntityData(profile)
      console.log(base)
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