import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import moment from 'moment'
import { google } from 'googleapis'
import { MongoTransferer, MongoDBDuplexConnector, LocalFileSystemDuplexConnector } from 'mongodb-snapshot';

const minimumInterval = 1000 * 10
const currentInterval = 1000 * 60
const checkforChanges = 1000 * 10

export default async () => {
    setInterval(async () => {
        let env = ''
        try { env = fs.readFileSync(path.resolve('./.env'), { encoding: 'utf8' }) } catch (e) {}
        let obj = dotenv.parse(env)
        let interval = obj['backup-interval']
        interval = parseInt(interval)
        if (interval < minimumInterval) return
        else if (interval !== currentInterval) {
            currentInterval = interval
            clearInterval(backupInterval)
            backupInterval = setInterval(() => backup(), currentInterval)
            backup()
        }
    }, checkforChanges)
}

let backupInterval = setInterval(() => backup(), currentInterval)

let getdbname = (uri) => {
    uri = uri.split('?')
    uri = uri[0]
    uri = uri.split('/')
    return uri[uri.length-1]
}

let backup = () => {
    let env = ''
    try { env = fs.readFileSync(path.resolve('./.env'), { encoding: 'utf8' }) } catch (e) {}
    let obj = dotenv.parse(env)
    let uri = obj['mongodb']
    let credentials = obj['google-secret']
    let folder = obj['google-folder']
    if (uri && credentials && folder) {
        try {
            let secret = Buffer.from(credentials, 'base64')
            let credentials = JSON.parse(secret)
            let dbname = getdbname(uri)
            await dump(uri, dbname)
            upload(credentials, folder, dbname + '-' + moment().format('YYYY-MM-DD HH.mm') + '.tar')
        } catch(e) {
            console.log(e)
        }
    }
}

let dump = async (uri, dbname) => {
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