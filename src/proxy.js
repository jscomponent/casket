import http from 'http'
import https from 'https'
import tls from 'tls'
import fs from 'fs'
import path from 'path'
import url from 'url'
import httpProxy from 'http-proxy'
import express from 'express'
import mongoose from 'mongoose'
import compression from 'compression'

export default (app) => {

    let notFound = express()
    notFound.get('/', (req, res) => { res.send('404 Not Found :/') }).listen(8001)

    let demo = express()
    demo.get('/', (req, res) => { res.send('Demo ^^ 🥷🏼') }).listen(8002)

    let wellknown = express()
    wellknown.use((req, res, next) => {
        let domain = req.headers.host
        let host = domain.split(':')[0]
        if (req.path?.startsWith('/.well-known')) {
            return res.sendFile(path.resolve('../casket_volume/domains/' + host + req.path))
        }
        next()
    })
    wellknown.listen(8003)

    let staticserver = express()
    staticserver.use(compression)
    staticserver.use((req, res, next) => {
        let domain = req.headers.host
        let host = domain.split(':')[0]
        if (host.startsWith('www.')) host = host.replace('www.', '')
        let file = path.resolve('../casket_volume/sites/' + host + '/public' + req.path)
        if (fs.existsSync(file)) return res.sendFile(file)
        next()
    })
    staticserver.get('*', (req, res) => {
        let domain = req.headers.host
        let host = domain.split(':')[0]
        if (host.startsWith('www.')) host = host.replace('www.', '')
        let p = path.resolve('../casket_volume/sites/' + host + '/public/index.html')
        try {
            res.sendFile(p)
        } catch (error) {
            res.json({ success: false, message: 'Something went wrong', path: p })
        }
    })
    staticserver.listen(8004)

    let proxy = httpProxy.createProxyServer({})
    proxy.on('proxyReq', (proxyReq, req, res, options) => {
        proxyReq.setHeader('X-Special-Proxy-Header', 'foobar')
    })

    let sites = async () => {
        if (process.env.mongodb) {
            mongoose.set('strictQuery', false)
            await mongoose.connect(process.env.mongodb)
            let domain = mongoose.models['types/domains'] || mongoose.model('types/domains', {
                match: { type: String },
                host: { type: String },
                port: { type: Number },
                secure: { type: Boolean },
                redirect: { type: String }
            })
            return await domain.find()
        }
        return []
    }

    let router = async (req) => {
        let domain = req.headers.host
        if (!domain) {
            console.log('router called without domain', req.headers)
            return {
                host: 'localhost',
                port: 8003
            }
        }
        let host = domain.split(':')[0]
        let domains = await sites()
        let route = null
        let path = url.parse(req.url, true).pathname
        if (path.startsWith('/.well-known')) return {
            host: 'localhost',
            port: 8003
        }
        if (host.startsWith('hub.')) return {
            host: 'localhost',
            port: process.env.port
        }
        domains.forEach(site => {
            if (host === site?.match) route = {
                host: site?.host || 'localhost',
                port: site?.port,
                secure: site?.secure,
                redirect: site?.redirect
            }
            else if (site?.match === '*' && !route) route = {
                host: site?.host || 'localhost',
                port: site?.port,
                secure: site?.secure,
                redirect: site?.redirect
            }
        })
        return route || { host: 'localhost', port: process.env.port, secure: false }
    }

    http.createServer(async (req, res) => {
        let target = await router(req)
        if (target.redirect) {
            res.writeHead(301, {Location: target.redirect})
            res.end()
        }
        if (target.secure) {
            res.writeHead(301, {Location: `https://${req.headers.host}${req.url}`})
            res.end()
        }
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
    }).listen(process.env.proxyport || 80, console.log('Proxy listening on http://localhost:' + (process.env.proxyport || 80)))

    https.createServer({
        SNICallback(domain, cb) {
            let ctx = null
            if (fs.existsSync(path.resolve('../casket_volume/domains/' + domain + '/fullchain.pem'))) {
                try {
                    ctx = tls.createSecureContext({
                        key: fs.readFileSync(path.resolve('../casket_volume/domains/' + domain + '/privkey.pem'), 'ascii'),
                        cert: fs.readFileSync(path.resolve('../casket_volume/domains/' + domain + '/fullchain.pem'), 'ascii')
                    })
                } catch(e) {
                    fs.rmSync(path.resolve('../casket_volume/domains/' + domain + '/fullchain.pem'))
                    if (fs.existsSync(path.resolve('../casket_volume/domains/' + domain + '/privkey.pem'))) {
                        fs.rmSync(path.resolve('../casket_volume/domains/' + domain + '/privkey.pem'))
                    }
                    ctx = tls.createSecureContext({
                        key: fs.readFileSync(path.resolve('./server.key'), 'ascii'),
                        cert: fs.readFileSync(path.resolve('./server.crt'), 'ascii')    
                    })
                }
            } else {
                ctx = tls.createSecureContext({
                    key: fs.readFileSync(path.resolve('./server.key'), 'ascii'),
                    cert: fs.readFileSync(path.resolve('./server.crt'), 'ascii')    
                })
            }
            cb(null, ctx)
        },
        key: fs.readFileSync(path.resolve('./server.key'), 'ascii'),
        cert: fs.readFileSync(path.resolve('./server.crt'), 'ascii')     
    }, async (req, res) => {
        req.headers['X-Forwarded-Proto'] = 'https'
        req.headers['Forwarded'] = 'proto=https'
        let target = await router(req)
        if (target.redirect) {
            res.writeHead(301, {Location: target.redirect})
            res.end()
        }
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
    }).listen(process.env.proxyportssl || 443, console.log('Proxy listening on https://localhost'))

}