const aws = require('aws-sdk');
const moment = require('moment');

const formatToDynamo = (guest) => {
  let json = {
    Id: moment().valueOf(),
    FirstName: guest.firstName,
    LastName: guest.lastName,
    Partner: guest.hasPartner,
    AddedAtUTC: moment().utc().format('MM-DD-YYYY h:mm:ss a')
  };
  if (guest.hasPartner){
    json.PartnerFirstName = guest.parnerFirstName
    json.PartnerLastName = guest.parnerLastName
  }
  return aws.DynamoDB.Converter.marshall(json);
};

module.exports = {
  formatToDynamo
};