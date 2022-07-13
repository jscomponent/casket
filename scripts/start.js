#!/usr/bin/env node

import { execSync } from 'child_process'
import name from './ensure-name.js'

execSync(`NODE_OPTIONS=--experimental-vm-modules npm run build; pm2 start src/index.js -n ${name} -f --watch; pm2 save`)

console.log(`Instance ${name} has started`)