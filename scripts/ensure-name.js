#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

let env = ''
// eslint-disable-next-line no-empty
try { env = fs.readFileSync(path.resolve('./.env'), { encoding: 'utf8' }) } catch (e) {}
let objenv = dotenv.parse(env)
if (!objenv.name) {
    objenv.name = Math.random().toString(36).slice(2, 7)
    let str = ''
    Object.keys(objenv).forEach(key => str += key + ' = ' + objenv[key] + '\n')
    fs.writeFileSync(path.resolve('./.env'), str, { encoding: 'utf8', flag: 'w' })
}

export default objenv.name