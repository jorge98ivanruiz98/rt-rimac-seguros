// src/handlers/getPeople.js
const { fetchPersonFromSWAPI } = require('../services/swapiService');
const { buildResponse } = require('../utils/responseBuilder');
const Constants = require('../utils/Constants').CONSTANTS;

exports.handler = async (event) => {
  try {
    console.log("Event Received:", JSON.stringify(event));

    const { id } = event.queryStringParameters;

    if (!id) {
      console.error("Error: 'id' parameter is missing.");
      return buildResponse(Constants.STATUS_CODE_ERROR_400, { message: "El parámetro 'id' es obligatorio" });
    }

    // Llamada a SWAPI en lugar de DynamoDB
    const data = await fetchPersonFromSWAPI(id);

    return buildResponse(Constants.STATUS_CODE_OK, { message: "Elemento recuperado exitosamente RT-RIMAC", data });
  } catch (error) {
    console.error("Unhandled Error:", error);
    return buildResponse(Constants.STATUS_CODE_ERROR_500, { message: "Error al recuperar el elemento desde SWAPI" });
  }
};
