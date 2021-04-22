'use strict';

const { putItem } = require('/opt/nodejs/common/dynamoDB');
const { formatToDynamo } = require('/opt/nodejs/common/helpers');

exports.handler = async event => {
  try {
    console.log(JSON.stringify(event))
    let res = await putItem(formatToDynamo({
      FirstName: "Miguel Angel",
      LastName: "Ramirez-Zablah Davila",
      Partner: true,
      PartnerFirstName: "Maria Jose",
      PartnerLastName: "Cepeda Santos"
    }));
    console.log("DynamoDB-Log: " + res);
    return {statusCode: 200}
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};

