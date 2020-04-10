# DYNAMODB-EVENTSTORE

Simple event store implementation with DynamoDB.

## Installation

```
npm i @sahtivahti/dynamodb-eventstore
```

## Usage

```javascript
const eventstore = require('@sahtivahti/dynamodb-eventstore')

await eventstore.addEvents('mystreamid', [{ type: 'ItemAdded', name: 'Foo Bar' }])

const events = await eventstore.getEvents('mystreamid')
```

## Example

See [example](./example) for example usage. The project may be deployed with `serverless` using following command.

```
sls deploy
```

### Get events

```
sls invoke -f getEvents
```

### Put events

```
sls invoke -f putEvents --data "{ type: 'ItemAdded', value: 12 }"
```
