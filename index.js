const { promisify } = require('util')
const DynamoDB = require('aws-sdk').DynamoDB

const ddb = new DynamoDB()
const dc = new DynamoDB.DocumentClient()

ddb.putItem = promisify(ddb.putItem)
dc.query = promisify(dc.query)

const eventstore = config => {
  const tableName = config.tableName || process.env.EVENTSTORE_TABLE || 'eventstore-events'

  return {
    addEvents: async (aggregateId, events) => {
      for (const event of events) {
        const params = {
          TableName: tableName,
          Item: {
            aggregateId: { S: aggregateId },
            timestamp: { S: new Date().getTime().toString() },
            payload: { S: JSON.stringify(event) }
          },
          ExpressionAttributeNames: {
            '#timestamp': 'timestamp'
          },
          ConditionExpression: 'attribute_not_exists(aggregateId) and attribute_not_exists(#timestamp)'
        }

        await ddb.putItem(params)
      }
    },
    getEvents: async aggregateId => {
      const query = {
        TableName: tableName,
        KeyConditionExpression: '#aggregateId = :aggregateId',
        ExpressionAttributeNames: {
          '#aggregateId': 'aggregateId'
        },
        ExpressionAttributeValues: {
          ':aggregateId': aggregateId
        }
      }

      const data = await dc.query(query)

      return data.Items.map(x => ({
        ...x,
        payload: JSON.parse(x.payload)
      }))
    }
  }
}

module.exports = eventstore
