import http from 'http'
import https from 'https'
import httpProxy from 'http-proxy'
import express from 'express'
import mongoose from 'mongoose'

export default () => {

    let notFound = express()
    notFound.get('/', (req, res) => { res.send('404 Not Found :/') }).listen(8001)

    let demo = express()
    demo.get('/', (req, res) => { res.send('Demo ^^ 🥷🏼') }).listen(8002)

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
        if (host.startsWith('hub.')) return { host: 'localhost', port: process.env.port }
        domains.forEach(site => {
            if (host === site.match) route = { host: site.host || 'localhost', port: site.port }
            else if (site.match === '*' && !route) route = { host: site.host || 'localhost', port: site.port }
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
    }).listen(80, console.log('Proxy listening on http://localhost'))

    https.createServer({}, async (req, res) => {
        let options = {}
        let target = await router(req)
        options.target = target
        if (!'sslexists') {
            options.ssl = {
                key: fs.readFileSync('valid-ssl-key.pem', 'utf8'),
                cert: fs.readFileSync('valid-ssl-cert.pem', 'utf8')
            }
        }
        proxy.web(req, res, options, e => {
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
    }).listen(443, console.log('Proxy listening on https://localhost'))

}