const aws = require('aws-sdk');
const moment = require('moment');

const formatToDynamo = (guest) => {
  let json = {
    Id: moment().valueOf().toString(),
    FirstName: guest.firstName,
    LastName: guest.lastName,
    Partner: guest.hasPartner,
    AddedAtUTC: moment().utc().format('MM-DD-YYYY h:mm:ss a')
  };
  if (guest.hasPartner){
    json.PartnerFirstName = guest.partnerFirstName
    json.PartnerLastName = guest.partnerLastName
  }
  return aws.DynamoDB.Converter.marshall(json);
};

module.exports = {
  formatToDynamo
};