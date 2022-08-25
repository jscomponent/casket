import http from 'http'
import https from 'https'
import fs from 'fs'
import path from 'path'
import url from 'url'
import httpProxy from 'http-proxy'
import express from 'express'
import mongoose from 'mongoose'

export default () => {

    let notFound = express()
    notFound.get('/', (req, res) => { res.send('404 Not Found :/') }).listen(8001)

    let demo = express()
    demo.get('/', (req, res) => { res.send('Demo ^^ 🥷🏼') }).listen(8002)

    let wellknown = express()
    wellknown.use((req, res, next) => {
        let domain = req.headers.host
        let host = domain.split(':')[0]
        if (req.path?.startsWith('/.well-known')) {
            return res.sendFile(path.resolve('./domains/' + host + req.path))
        }
        next()
    })
    wellknown.listen(8003)

    let proxy = httpProxy.createProxyServer({})
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        proxyReq.setHeader('X-Special-Proxy-Header', 'foobar')
    })

    let sites = async () => {
        if (process.env.mongodb) {
            await mongoose.connect(process.env.mongodb)
            let domain = mongoose.models['types/domains'] || mongoose.model('types/domains', {
                match: { type: String },
                host: { type: String },
                port: { type: Number }
            })
            return await domain.find()
        }
        return []
    }

    let router = async (req) => {
        let domain = req.headers.host
        let host = domain.split(':')[0]
        let domains = await sites()
        let route = null
        let path = url.parse(req.url, true).pathname
        if (path.startsWith('/.well-known')) return { host: 'localhost', port: 8003 }
        if (host.startsWith('hub.')) return { host: 'localhost', port: process.env.port }
        domains.forEach(site => {
            if (host === site.match) route = { host: site.host || 'localhost', port: site.port }
            //else if (site.match === '*' && !route) route = { host: site.host || 'localhost', port: site.port }
        })
        return route || { host: 'localhost', port: process.env.port }
    }

    http.createServer(async (req, res) => {
        let target = await router(req)
        proxy.web(req, res, { target }, e => {
            proxy.web(req, res, { target: { host: 'localhost', port: 8001 } }, err => {
                console.log('err', err)
            })
        })
    }).on('upgrade', async (req, socket, head) => {
        let target = await router(req)
        proxy.ws(req, socket, head, { target }, e => {
            proxy.ws(req, socket, head, { target: { host: 'localhost', port: 8001 } }, err => {
                console.log('err', err)
            })
        })
    }).listen(process.env.proxyport || 80, console.log('Proxy listening on http://localhost:' + process.env.proxyport || 80))

    https.createServer({}, async (req, res) => {
        let options = {}
        let target = await router(req)
        options.target = target
        if (fs.existsSync(path.resolve('./domains/' + options.target?.host + '/fullchain.pem'))) {
            options.ssl = {
                key: fs.readFileSync(path.resolve('./domains/' + options.target?.host + '/privkey.pem'), 'ascii'),
                cert: fs.readFileSync(path.resolve('./domains/' + options.target?.host + '/fullchain.pem'), 'ascii')
            }
        }
        proxy.web(req, res, options, e => {
            proxy.web(req, res, { target: { host: 'localhost', port: 8001 } }, err => {
                console.log('err', err)
            })
        })
    }).on('upgrade', async (req, socket, head) => {
        let options = {}
        let target = await router(req)
        options.target = target
        if (fs.existsSync(path.resolve('./domains/' + options.target?.host + '/fullchain.pem'))) {
            options.ssl = {
                key: fs.readFileSync(path.resolve('./domains/' + options.target?.host + '/privkey.pem'), 'ascii'),
                cert: fs.readFileSync(path.resolve('./domains/' + options.target?.host + '/fullchain.pem'), 'ascii')
            }
        }
        proxy.ws(req, socket, head, options, e => {
            proxy.ws(req, socket, head, { target: { host: 'localhost', port: 8001 } }, err => {
                console.log('err', err)
            })
        })
    }).listen(443, console.log('Proxy listening on https://localhost'))

}