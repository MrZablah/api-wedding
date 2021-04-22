const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const table = process.env.DYNAMO_TABLE;

const getItem = (jsonParams) => {
  let params = {
    Key: jsonParams,
    TableName: table,
    ReturnConsumedCapacity: 'NONE'
  };
  return new Promise((resolve, reject) => {
    dynamodb.getItem(params, (err, data) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(data)
      }
    });
  });
};

const putItem = (jsonParams) => {
  let params = {
    TableName: table,
    Item: jsonParams,
    ReturnValues : 'ALL_OLD',
    ConditionExpression: 'attribute_not_exists(Id)'
  };
  return new Promise((resolve, reject) => {
    dynamodb.putItem(params, (err, data) => {
      console.log(err, data, 'err data');
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const deleteItem = (deleteId) => {
  let dynamoItem = {Id: { S: deleteId }};
  let params = {
    Key: dynamoItem,
    TableName: table,
    ReturnValues: 'ALL_OLD'
  };
  return new Promise((resolve, reject) => {
    dynamodb.deleteItem(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
};

const saveByBatch = (batch) => {
  let params = {
    'RequestItems': {
      [table]: batch
    }
  }
  return new Promise((resolve, reject) => {
    dynamodb.batchWriteItem(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
}
module.exports = {
  getItem,
  putItem,
  deleteItem,
  saveByBatch
};
