// src/services/dynamoService.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { DYNAMODB_TABLE_NAME } = process.env;

exports.saveToDynamoDB = async (data) => {
  try {
    const params = {
      TableName: DYNAMODB_TABLE_NAME,
      Item: data,
    };
    await dynamoDB.put(params).promise();
  } catch (error) {
    console.error("Error guardando en DynamoDB:", error);
    throw new Error("No se pudo guardar el elemento en DynamoDB");
  }
};

exports.fetchFromDynamoDB = async (id) => {
  try {
    const params = {
      TableName: DYNAMODB_TABLE_NAME,
      Key: { id },
    };
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      console.warn(`Elemento con ID ${id} no encontrado en DynamoDB`);
    }
    return result.Item;
  } catch (error) {
    console.error("Error al recuperar de DynamoDB:", error);
    throw new Error("No se pudo recuperar el elemento de DynamoDB");
  }
};
