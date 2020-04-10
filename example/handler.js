const eventstore = require('./evenstore')({ tableName: 'example-events-table' })

const aggregateId = 'my-aggregate-id'

const get = async () => {
  const items = await eventstore.getEvents(aggregateId)

  return { items }
}

const put = async event => {
  await eventstore.addEvents(aggregateId, [event])

  const items = await eventstore.getEvents(aggregateId)

  return { items }
}

module.exports = { get, put }
