const AWS = require('aws-sdk');
const moment = require('moment-timezone');
const docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const table = process.env.DYNAMO_TABLE;

const getItem = (idAttributeName, item) => {
  let params = {
    Key: {},
    TableName: table,
    ReturnConsumedCapacity: 'NONE'
  };
  params["Key"][idAttributeName] = item[idAttributeName];

  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
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
    Item: {
      CreatedAt: moment().tz("America/Monterrey").format('MM-DD-YYYY h:mm:ss a'),
      ...jsonParams
    },
    ReturnValues : 'ALL_OLD',
    ConditionExpression: 'attribute_not_exists(Id)'
  };
  console.log(params)
  console.log(params.Item)
  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      console.log(err, data, 'err data');
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const updateItem = (idAttributeName, item) => {
  item["UpdatedAt"] = moment().tz("America/Monterrey").format('MM-DD-YYYY h:mm:ss a');
  let params = {
    TableName: table,
    Key: {},
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: "",
    ReturnValues: "UPDATED_NEW"
  };

  params["Key"][idAttributeName] = item[idAttributeName];
  let prefix = "set ";
  let attributes = Object.keys(item);
  for (let i=0; i<attributes.length; i++) {
    let attribute = attributes[i];
    if (attribute !== idAttributeName) {
      params["UpdateExpression"] += prefix + "#" + attribute + " = :" + attribute;
      params["ExpressionAttributeValues"][":" + attribute] = item[attribute];
      params["ExpressionAttributeNames"]["#" + attribute] = attribute;
      prefix = ", ";
    }
  }
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      console.log(err, data, 'err data');
      if(err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const deleteItem = (idAttributeName, item) => {
  let params = {
    Key: {},
    TableName: table,
    ReturnValues: 'ALL_OLD'
  };
  params["Key"][idAttributeName] = item[idAttributeName];
  return new Promise((resolve, reject) => {
    docClient.delete(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
};

const writeBatch = (batch) => {
  let params = {
    'RequestItems': {
      [table]: batch
    }
  }
  return new Promise((resolve, reject) => {
    docClient.batchWrite(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
}

const getBatch = (batch) => {
  let params = {
    'RequestItems': {
      [table]: {
        Keys: batch
      }
    }
  }
  return new Promise((resolve, reject) => {
    docClient.batchGet(params, (err, data) => {
      if(err) reject(err);
      else resolve(data);
    });
  });
}

module.exports = {
  getItem,
  putItem,
  updateItem,
  deleteItem,
  writeBatch,
  getBatch
};
