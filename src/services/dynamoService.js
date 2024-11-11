// src/services/dynamoService.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { DYNAMODB_TABLE_NAME } = process.env;

exports.saveToDynamoDB = async (data) => {
  const params = {
    TableName: DYNAMODB_TABLE_NAME,
    Item: data,
  };
  await dynamoDB.put(params).promise();
};

exports.fetchFromDynamoDB = async (id) => {
  const params = {
    TableName: DYNAMODB_TABLE_NAME,
    Key: { id },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
};
