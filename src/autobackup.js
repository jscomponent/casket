import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { google } from 'googleapis'
import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';


export default async () => {
    
    //setInterval(async () => {
        /*
        let env = ''
        try { env = fs.readFileSync(path.resolve('./.env'), { encoding: 'utf8' }) } catch (e) {}
        let obj = dotenv.parse(env)
        if (obj['google-secret']) {
            let secret = Buffer.from(obj['google-secret'], 'base64')
            let credentials = JSON.parse(secret)
            let folder = obj['google-folder']
            await dump(obj['mongodb'])
            upload(credentials, folder, 'backup2.tar')
        }
        */
    //}, 1000 * 60 * 24)
}

let dump = async (uri) => {
    let dbname = uri.split('?')
    dbname = dbname[0]
    dbname = dbname.split('/')
    dbname = dbname[dbname.length-1]
    const mongo_connector = new MongoDBDuplexConnector({
        connection: { uri, dbname }
    })
    const localfile_connector = new LocalFileSystemDuplexConnector({
        connection: {
            path: './backup.tar'
        }
    })
    const transferer = new MongoTransferer({
        source: mongo_connector,
        targets: [localfile_connector]
    })
    for await (const { total, write } of transferer) {
        console.log(`Backup - remaining bytes to write: ${total - write}`)
    }
}

let upload = (token, folder, name) => {
    const SCOPES = ['https://www.googleapis.com/auth/drive.file']
    const auth = new google.auth.GoogleAuth({
        credentials: token,
        scopes: SCOPES
    })
    const drive = google.drive({version: 'v3', auth})
    drive.files.create({
        resource: { name, parents: [folder] },
        media: {
            mimeType: 'application/tar',
            body: fs.createReadStream(path.resolve('./backup.tar'))
        },
        fields: 'id'
    }, (err, file) => {
        if (err) console.error(err)
        else console.log('Backup uploaded! ID: ', file.data.id)
    })
}