export default app => {

  if (typeof app.channel !== 'function') return

  app.on('connection', connection => {
    app.channel('anonymous').join(connection) // first join anonym
  })

  app.on('login', (authResult, { connection }) => {
    if (connection) {

      // const user = connection.user
      app.channel('anonymous').leave(connection) // then swap to authenticated
      app.channel('authenticated').join(connection)
      
      // if (user.isAdmin) { app.channel('admins').join(connection) }
      // app.channel(`userIds/${user.id}`).join(connection) // private channel

    }
  })

  app.publish(/*(data, context)*/() => {
    // console.log('an event will be emitted', data, context)
    // if (data) === '' return [app.channel('guest'), app.channel('all')]
    return app.channel('authenticated')
  })

  app.service('users').publish('created', (data, context) => {
    return [
      app.channel('admins'),
      app.channel(app.channels).filter(connection =>
        connection.user._id === context.params.user._id
      )
    ]
  })
  
  // Select who should receive which events on calls from the different services
  /*
  app.service('messages').publish((data, context) => {
    console.log('an event will be emitted from the message service', context)
    return [
      app.channel(`userIds/${data.createdBy}`),
      app.channel(`emails/${data.recipientEmail}`)
    ]
  })
  */
}
