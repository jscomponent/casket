import 'dotenv/config'
import cluster from 'cluster'
import os from 'os'
import logger from './logger.js'
import app from './app.js'

const cpus = os.cpus().length

if (!cluster.isPrimary || cpus <= 1) {

  if (process.env.port) app.set('port', process.env.port)
  const port = app.get('port')

  app.listen(port).then(server => {

    process.on('unhandledRejection', (reason, p) =>
      logger.error('Unhandled Rejection at: Promise ', p, reason)
    )

    server.on('listening', () =>
      logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
    )

  }).catch(e => {
    console.log('could not listen on port', e)
  })

} else {

  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }

}
