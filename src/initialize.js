import autobackup from './autobackup.js'
import proxy from './proxy.js'

export default () => {
    console.log('Initializing')
    if (process.env?.webmaster === 'true') {
        console.log('Is webmaster')
        proxy()
    }
    if (process.env?.autobackup === 'true') {
        console.log('Auto backup detected')
        autobackup()
    }
}