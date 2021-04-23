const formatRes = (code, payload) => {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(payload)
  };
};

module.exports = {
  formatRes
};