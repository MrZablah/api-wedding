'use strict';

const {formatRes}  = require('/opt/nodejs/common/helpers');
const {updateItem} = require('/opt/nodejs/common/dynamoDB');

exports.handler = async event => {
  try {
    let guestJson = JSON.parse(event.body);
    await validate(guestJson);
    await updateItem("Id", guestJson);
    return formatRes(200, {
      message: "The guest was updated successfully"
    });
  } catch (err) {
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
  if (!json.hasOwnProperty("HasConfirm"))
    reject({code: 'validationError', message: "Missing 'HasConfirm' on Json or it's not on formatted correctly."});

  // Check is the correct format
  if (typeof json.Id !== "number" && !Boolean(json.Id))
    reject({code: 'validationError', message: "'Id' has to be a 'number' and it can't be empty."});
  if (typeof json.HasConfirm !== "boolean")
    reject({code: 'validationError', message: "'HasConfirm' has to be a 'boolean' and it can't be empty."});

  resolve("It's valid!");
});

