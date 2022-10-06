import { AuthenticationService, AuthenticationBaseStrategy, JWTStrategy } from '@feathersjs/authentication'
import { LocalStrategy } from '@feathersjs/authentication-local'
import { oauth, OAuthStrategy } from '@feathersjs/authentication-oauth'
import axios from 'axios'
import crypto from 'crypto'

export default async app => {
  const authentication = new AuthenticationService(app)

  class AnonymousStrategy extends AuthenticationBaseStrategy {
    async authenticate(authentication, params) {
      return { anonymous: true }
    }
  }
  
  class OAuthAutoRegisterStrategy extends OAuthStrategy {

    async findEntity(profile, params) {
      let entity = await super.findEntity(profile, params)
      if (!entity) {
        if (profile.email) {
          let users = await app.service('/users').find({ query: { email: profile.email } })
          for await (let entity of users.data) {
            if (!entity[this.name + 'Id']) {
              let user = {}
              user[this.name + 'Id'] = profile.sub || profile.id
              if (!entity.name) user.name = profile.name
              if (!entity.picture) user.picture = profile.picture
              if (!entity.email_verified) user.email_verified = profile.email_verified
              if (!entity.locale) user.locale = profile.locale
              await app.service('/users').patch(entity._id, user)
              return super.findEntity(profile, params)
            }
          }
        }
        await this.createEntity(profile, params)
        return super.findEntity(profile, params)
      }
      return entity
    }

    async createEntity(profile) {
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
    }

    async getAllowedOrigin (params) {

      let config = app.get('authentication')
      let origins = config?.oauth?.origins

      console.log('origins', origins)

      if (Array.isArray(origins)) {
        const origin = params.origin || ''
        console.log('origin', origin)
        const allowedOrigin = origins.find(current => origin.toLowerCase() === current.toLowerCase())
        console.log('allowedOrigin', allowedOrigin)
        if (!allowedOrigin) return super.getAllowedOrigin(params)
        return allowedOrigin
      }
      
      return super.getAllowedOrigin(params)

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
      data.picture = data.picture?.data?.url
      return data
    }
    async getEntityData(profile) {
      const baseData = await super.getEntityData(profile)
      return {
        ...baseData,
        name:  profile.name,
        email: profile.email,
        picture: profile.picture
      }
    }
  }

  authentication.register('jwt', new JWTStrategy())
  authentication.register('local', new LocalStrategy())
  authentication.register('anonymous', new AnonymousStrategy())
  authentication.register('google', new GoogleStrategy())
  authentication.register('facebook', new FacebookStrategy())
  authentication.register('github', new GithubStrategy())

  if (app.lookup('/authentication')) await app.unuse('/authentication')

  app.set('oauth', oauth)

  app.use('/authentication', authentication)
  app.configure(oauth())
}