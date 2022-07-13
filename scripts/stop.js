#!/usr/bin/env node

import { execSync } from 'child_process'
import name from './ensure-name.js'

execSync(`pm2 stop ${name}`)

console.log(`Instance ${name} was stopped`)