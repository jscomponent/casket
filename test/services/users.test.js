import app from '../../src/app.js'

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users')
    expect(service).toBeTruthy()
  })
})
