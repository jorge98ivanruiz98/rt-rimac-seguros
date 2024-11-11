// src/utils/responseBuilder.js
exports.buildResponse = (statusCode, body) => ({
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  