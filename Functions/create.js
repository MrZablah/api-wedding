'use strict';

const { putItem } = require('/opt/nodejs/common/dynamoDB');
const { formatToDynamo } = require('/opt/nodejs/common/helpers');

exports.handler = async event => {
  try {
    console.log(JSON.stringify(event));
    let res = await putItem(formatToDynamo({
      firstName: "Miguel Angel",
      lastName: "Ramirez-Zablah Davila",
      hasPartner: true,
      partnerFirstName: "Maria Jose",
      partnerLastName: "Cepeda Santos"
    }));
    console.log("DynamoDB-Log: " + res);
    return {statusCode: 200};
  } catch (err) {
    return { statusCode: 500, body: err.message };
  }
};

