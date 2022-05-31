import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import auth from '@feathersjs/authentication-client'
import io from 'socket.io-client'
import { server } from '../../package.json'

let socket = io(server)
let $io = feathers()
$io.configure(socketio(socket))
$io.configure(auth())

export default {
    install(app) {
        localStorage.removeItem('ready')
        localStorage.removeItem('user')
        $io.service('settings').get('status').then(response => {
            let ready = response === 'ready'
            localStorage.setItem('ready', ready)
            if (!ready) app.$router.push('/setup')
            else {
                $io.reAuthenticate().then(response => {
                    $io.service('settings').patch('lang', { value: 'en, no' }).then(response => {
                        console.log('response from setting langstrings', response)
                    })
                    localStorage.setItem('user', JSON.stringify(response))
                    localStorage.setItem('ready', true)
                    app.$router.push(localStorage.getItem('history') || '/')
                }).catch((e) => {
                    app.$router.push('/login')
                })
            }
        }).catch(e => {
            localStorage.removeItem('ready')
            localStorage.removeItem('user')
            app.$router.push('/await')
        })
        app.$io = $io
        app.provide('io', $io)
    }
}