const ddb = exports
const aws = require('aws-sdk')

ddb.connect = () => {
  return new aws.DynamoDB.DocumentClient(options())
}

function options () {
  if (process.env.DYNAMODB_ENDPOINT) {
    return {
      region: 'localhost',
      endpoint: process.env.DYNAMODB_ENDPOINT
    }
  } else {
    return {}
  }
}
