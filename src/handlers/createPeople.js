// src/handlers/createPeople.js
const Ajv = require('ajv');
const createPersonSchema = require('../schemas/request.jsonBody.json');
const { saveToDynamoDB } = require('../services/dynamoService');
const { buildResponse } = require('../utils/responseBuilder');
const Constants = require('../utils/Constants').CONSTANTS;

exports.handler = async (event) => {
  try {
    // Parsear el cuerpo de la solicitud
    const requestBody = JSON.parse(event.body);
    const ajv = new Ajv();
    // Compilar el esquema y validar
    const validate = ajv.compile(createPersonSchema);
    const isValid = validate(requestBody);

    if (!isValid) {
      // Si no es válido, retornar un error 400 con los detalles de validación
      return buildResponse(Constants.STATUS_CODE_ERROR_400, {
        message: "Solicitud inválida",
        errors: validate.errors,
      });
    }

    await saveToDynamoDB(requestBody);

    return buildResponse(Constants.STATUS_CODE_OK_CREATE, { message: "Elemento creado exitosamente", data: requestBody });
  } catch (error) {
    console.error("Error en createPeople:", error);
    return buildResponse(Constants.STATUS_CODE_ERROR_500, { message: "Error al crear el elemento" });
  }
};
