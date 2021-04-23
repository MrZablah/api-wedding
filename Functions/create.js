'use strict';

const {formatRes} = require('/opt/nodejs/common/helpers');
const {putItem}   = require('/opt/nodejs/common/dynamoDB');

exports.handler = async event => {
  try {
    let guestJson = JSON.parse(event.body);
    await validate(guestJson);
    await putItem(guestJson);
    return formatRes(200, {
      message: "The guest was saved successfully"
    });
  } catch (err) {
    if (err.code === 'ConditionalCheckFailedException')
      return formatRes(400, {
        message: 'Id already exist',
        exist: true
      });
    if (err.code === 'validationError')
      return formatRes(400, {
        message: err.message
      });
    return formatRes(err.hasOwnProperty("statusCode") ? err.statusCode: 500, err);
  }
};

const validate = json => new Promise((resolve, reject) => {
  // Check if value exists
  if (!json.hasOwnProperty("Id"))
    reject({code: 'validationError', message: "Missing 'Id' on Json or it's not on formatted correctly."});
  if (!json.hasOwnProperty("FirstName"))
    reject({code: 'validationError', message: "Missing 'FirstName' on Json or it's not on formatted correctly."});
  if (!json.hasOwnProperty("LastName"))
    reject({code: 'validationError', message: "Missing 'LastName' on Json or it's not on formatted correctly."});
  if (!json.hasOwnProperty("Partner"))
    reject({code: 'validationError', message: "Missing 'Partner' on Json or it's not on formatted correctly."});

  // Check is the correct format
  if (typeof json.Id !== "number" && !Boolean(json.Id))
    reject({code: 'validationError', message: "'Id' has to be a 'number' and it can't be empty."});
  if (typeof json.FirstName !== "string" && !Boolean(json.FirstName))
    reject({code: 'validationError', message: "'FirstName' has to be a 'string' and it can't be empty."});
  if (typeof json.LastName !== "string" && !Boolean(json.LastName))
    reject({code: 'validationError', message: "'LastName' has to be a 'string' and it can't be empty."});
  if (typeof json.Partner !== "boolean")
    reject({code: 'validationError', message: "'Partner' has to be a 'boolean' and it can't be empty."});

  resolve("It's valid!");
});

