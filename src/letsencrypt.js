import ACME from 'acme'
import Keypairs from '@root/keypairs'
import http01 from 'acme-http-01-webroot'
import punycode from 'punycode'
import CSR from '@root/csr'
import PEM from '@root/pem/packer.js'
import path from 'path'
import { promises as fs } from 'fs'

export default async (maintainer = 'webmaster@example.com', domain = 'localhost', production = true) => {
    try {
        let domains = [domain]
        domains = domains.map((name) => punycode.toASCII(name))

        let accountKeypair = await Keypairs.generate({ kty: 'EC', format: 'jwk' })
        let accountKey = accountKeypair.private

        let serverKeypair = await Keypairs.generate({ kty: 'RSA', format: 'jwk' })
        let serverKey = serverKeypair.private
        let serverPem = await Keypairs.export({ jwk: serverKey })

        await fs.mkdir(path.resolve('../casket_volume/domains/' + domain), {recursive: true})
        if (fs.existsSync(path.resolve('../casket_volume/domains/' + domain + '/privkey.pem'))) {
            fs.rmSync(path.resolve('../casket_volume/domains/' + domain + '/privkey.pem'))
        }
        await fs.writeFile(path.resolve('../casket_volume/domains/' + domain + '/privkey.pem'), serverPem, 'ascii')

        let acme = ACME.create({
            maintainerEmail: maintainer,
            packageAgent: 'airportal/v1.0.0',
            // notify: (ev, args) => console.log('notification', ev, args)
        })

        let prod = 'https://acme-v02.api.letsencrypt.org/directory'
        let stage = 'https://acme-staging-v02.api.letsencrypt.org/directory'
        await acme.init(production ? prod : stage)

        let account = await acme.accounts.create({
            subscriberEmail: maintainer,
            agreeToTerms: true, // @todo - This can be an async function
            accountKey
        })

        let csrDer = await CSR.csr({ jwk: serverKey, domains, encoding: 'der' })
        let csr = PEM.packBlock({ type: 'CERTIFICATE REQUEST', bytes: csrDer })
    
        let pems = await acme.certificates.create({
            account,
            accountKey,
            csr,
            domains,
            challenges: {
                'http-01': http01.create({ webroot: path.resolve('../casket_volume/domains/' + domain + '/.well-known/acme-challenge') }),
                /*'dns-01': {
                    async init(deps) {
                        console.log('deps', deps) // includes the http request object to use
                    },
                    async zones(args) {
                        console.log('zones', args) // return a list of zones
                    },
                    async set(args) {
                        console.log('set', args) // set a TXT record with the lowest allowable TTL
                    },
                    async get(args) {
                        console.log('get', args) // check the TXT record exists
                    },
                    async remove(args) {
                        console.log('remove', args) // remove the TXT record
                    },
                    propagationDelay: 5000
                }*/
            }
        })

        let fullchain = pems.cert + '\n' + pems.chain + '\n'
        if (fs.existsSync(path.resolve('../casket_volume/domains/' + domain + '/fullchain.pem'))) {
            fs.rmSync(path.resolve('../casket_volume/domains/' + domain + '/fullchain.pem'))
        }
        await fs.writeFile(path.resolve('../casket_volume/domains/' + domain + '/fullchain.pem'), fullchain, 'ascii')
        return true
    } catch (e) {
        console.log('err', e)
        return false
    }
}