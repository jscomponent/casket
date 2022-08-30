import autobackup from './autobackup.js'
import proxy from './proxy.js'

export default (app) => {
    console.log('Initializing')
    if (process.env?.webmaster === 'true') {
        console.log('Is webmaster')
        proxy(app)
    }
    autobackup()
}