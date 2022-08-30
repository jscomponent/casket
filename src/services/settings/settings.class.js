
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { execSync } from 'child_process'
import registerTypes from '../../register-types.js'
import adapter from '../../socket-adapter.js'
import middleware from '../../middleware/index.js'
import si from 'systeminformation'

export class Settings {

  async find() {
    return 'not-implementet'
  }

  async get(id) {
    if (id === 'status') {
      let env = ''
      // eslint-disable-next-line no-empty
      try { env = fs.readFileSync(path.resolve('./.env'), { encoding: 'utf8' }) } catch (e) {}
      let obj = dotenv.parse(env)
      if (obj.mongodb) {
        let users = await this.app.service('/users').find()
        if (!users?.data?.length) return 'admin-registration'
        return 'ready'
      }
      return 'setup'
    } else if (id === 'server') {
      let size = 0
      let used = 0
      let diskLayout = await si.diskLayout()
      diskLayout.forEach(l => size += l.size)
      let fsSize = await si.fsSize()
      fsSize.forEach(d => used += d.used)
      let mem = await si.mem()
      let npm = 'v' + execSync('npm -v').toString().trim()
      return { mem, size, used, node: process.version, npm }
    } else {
      let env = ''
      // eslint-disable-next-line no-empty
      try { env = fs.readFileSync(path.resolve('./.env'), { encoding: 'utf8' }) } catch (e) {}
      let obj = dotenv.parse(env)
      if (!obj[id]) return ''
      return obj[id]
    }
  }
  
  async create(data) {
    let status = await this.get('status')
    if (status === 'ready') return 'ready'
    if (!data.email || !data.email.includes('@')) return 'invalid-email'
    if (!data.password || data.password.length < 6) return 'invalid-password'
    if (!data.mongodb && status === 'setup') return 'mongo-connection-url-required'
    if (data.mongodb) {
      try {
        await mongoose.connect(data.mongodb)
        let env = ''
        // eslint-disable-next-line no-empty
        try { env = fs.readFileSync(path.resolve('./.env'), { encoding: 'utf8' }) } catch (e) {}
        let obj = dotenv.parse(env)
        obj['mongodb'] = data.mongodb
        obj['lang'] = 'en, no'
        obj['NODE_ENV'] = 'production'
        let str = ''
        Object.keys(obj).forEach(key => {
          process.env[key] = obj[key]
          str += key + ' = ' + obj[key] + '\n'
        })
        fs.writeFileSync(path.resolve('./.env'), str, { encoding: 'utf8', flag: 'w' })
      } catch(e) {
        return 'mongodb-could-not-connect'
      }
      this.app.set('mongodb', data.mongodb)
      this.app.set('mongooseClient', mongoose)
      await adapter(this.app.io, this.app)
      this.app.configure(middleware)
    }
    await this.app.service('/users').create({
      email: data.email,
      password: data.password,
      permissions: ['admin']
    })
    return 'ready'
  }

  async update() {
    return 'not-implementet'
  }

  async patch(id, data) {
    let status = await this.get('status')
    if (status !== 'ready') return 'setup-incomplete'
    let env = ''
    // eslint-disable-next-line no-empty
    try { env = fs.readFileSync(path.resolve('./.env'), { encoding: 'utf8' }) } catch (e) {}
    let obj = dotenv.parse(env)
    process.env[id] = obj[id] = data.value
    let str = ''
    Object.keys(obj).forEach(key => {
      str += key + ' = ' + process.env[key] + '\n'
    })
    fs.writeFileSync(path.resolve('./.env'), str, { encoding: 'utf8', flag: 'w' })
    registerTypes(this.app)
    return 'updated'
  }

  async remove() {
    return 'not-implementet'
  }

  async setup(app, path) {
    this.app = app
    this.path = path
  }

}
