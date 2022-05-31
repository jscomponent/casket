import cluster from 'cluster'
import os from 'os'
import logger from './logger.js'
import app from './app.js'

const cpus = os.cpus().length

if (!cluster.isPrimary || cpus <= 1) {

  const port = app.get('port')
  const server = app.listen(port)

  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  )

  server.on('listening', () =>
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
  )

} else {

  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }

}