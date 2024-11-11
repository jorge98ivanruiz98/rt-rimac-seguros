const { fetchPersonFromSWAPI } = require('../services/swapiService');
const { buildResponse } = require('../utils/responseBuilder');
const Constants = require('../utils/Constants').CONSTANTS;

exports.handler = async (event) => {
  try {
    console.log("Event Received:", JSON.stringify(event));
    const { id } = event.queryStringParameters;

    if (!id || isNaN(id) || parseInt(id) <= 0) {
      console.error("Error: 'id' parameter is missing or invalid.");
      return buildResponse(Constants.STATUS_CODE_ERROR_400, { message: "El parámetro 'id' es inválido, debe ser un número positivo" });
    }

    console.info(`Iniciando petición a SWAPI con ID: ${id}`);
    const data = await fetchPersonFromSWAPI(id);

    if (!data) {
      console.error(`Error: No data found for ID ${id}`);
      return buildResponse(Constants.STATUS_CODE_ERROR_404, { message: `No se encontró el elemento con ID ${id}` });
    }

    return buildResponse(Constants.STATUS_CODE_OK, { message: "Elemento recuperado exitosamente RT-RIMAC", data });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`SWAPI: No se encontró el elemento con ID ${id}`);
      return buildResponse(Constants.STATUS_CODE_ERROR_404, { message: `El elemento con ID ${id} no fue encontrado en SWAPI` });
    }
    if (error.code === 'ETIMEDOUT') {
      console.error("Timeout Error:", error);
      return buildResponse(Constants.STATUS_CODE_ERROR_503, { message: "Servicio SWAPI no disponible, intente nuevamente más tarde" });
    }
    console.error("Unhandled Error:", error);
    return buildResponse(Constants.STATUS_CODE_ERROR_500, { message: "Error al recuperar el elemento desde SWAPI" });
  }
};
