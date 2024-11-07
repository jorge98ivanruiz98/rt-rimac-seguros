'use strict';

// Importar SDK de AWS y Axios para realizar solicitudes HTTP
const AWS = require('aws-sdk');
const axios = require('axios');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Función para traducir los campos de inglés a español
// Recibe un objeto JSON y devuelve un nuevo objeto con los nombres de campo traducidos
const translateFields = (data) => {
  return {
    nombre: data.name,
    altura: data.height,
    peso: data.mass,
    color_pelo: data.hair_color,
    color_piel: data.skin_color,
    color_ojos: data.eye_color,
    nacimiento: data.birth_year,
    genero: data.gender,
    planeta_natal: data.homeworld,
    peliculas: data.films,
    especies: data.species,
    vehiculos: data.vehicles,
    naves: data.starships,
    creado: data.created,
    editado: data.edited,
    url: data.url,
  };
};

// Función para obtener un personaje de SWAPI y traducir los campos al español
// Devuelve los datos del personaje si se encuentra
module.exports.getCharacter = async (event) => {
  const { id } = event.pathParameters;

  try {
    // Llamada a SWAPI para obtener la información del personaje
    const response = await axios.get(`https://swapi.py4e.com/api/people/${id}/`);
    const translatedData = translateFields(response.data);

    // Respuesta con datos traducidos del personaje
    return createResponse(200, translatedData);
  } catch (error) {
    // Manejo de errores en la llamada a SWAPI
    return createResponse(500, { error: 'Error al obtener datos del personaje desde SWAPI' });
  }
};

// Función para guardar un elemento en DynamoDB
const saveToDynamoDB = async (item) => {
  const params = {
    TableName: 'RIMAC-PT-DEV',
    Item: item,
  };
  return dynamoDb.put(params).promise();
};

// Función para crear un personaje en DynamoDB a partir de la información enviada en el cuerpo de la solicitud
module.exports.createCharacter = async (event) => {
  let data = JSON.parse(event.body);
  //Se puede hacer una transformación como en getCharacter sería solamente descomentar el código, como no se pidió en el requerimiento se colocó comentado
  //data = translateFields(data);

  try {
    // Guardar el personaje en DynamoDB usando la función saveToDynamoDB
    await saveToDynamoDB(data);
    return createResponse(201, { message: 'Personaje creado exitosamente' });
  } catch (error) {
    // Manejo de errores al guardar el personaje en la base de datos
    return createResponse(500, { error: 'No se pudo crear el personaje en la base de datos' });
  }
};

// Función para manejar la respuesta dinámica en las funciones
const createResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
  };
};