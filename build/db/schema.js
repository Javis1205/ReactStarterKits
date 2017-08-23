import models from 'models'

// Create the tables:
// models.groups.sync()
// models.orders.sync({force: true})
// models.members.sync()
// models.messages.sync()
// models.status.sync({force: true})
models.shippers.sync({force: true})
// models.authors.sync()

// Force the creation!
// this will drop the table first and re-create it afterwards
// models.projects.sync({force: true}) 