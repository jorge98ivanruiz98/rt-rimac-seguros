const https = require('https');
const { SWAPI_BASE_URL } = process.env;

/**
 * Función para obtener información de una persona desde SWAPI
 * @param {string} id - El ID de la persona en SWAPI
 * @param {Object} options - Opciones para timeout y reintentos
 * @returns {Promise<Object>} - Promesa que resuelve con los datos traducidos de la persona
 */
const fetchPersonFromSWAPI = (id, options = { retry: 3, delay: 1000 }) => {
  const url = `${SWAPI_BASE_URL}/people/${id}/`;

  return new Promise((resolve, reject) => {
    let attempts = 0;

    const makeRequest = (url) => {
      https.get(url, (response) => {
        let data = '';

        // Manejo de redirecciones por si swapi no tenga la ruta correcta como "https o http" ó terminando su ruta /
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          console.log(`Redireccionando a ${response.headers.location}`);
          makeRequest(response.headers.location);
          return;
        }

        // Manejo de error 503 con reintentos
        if (response.statusCode === 503) {
          attempts++;
          if (attempts < options.retry) {
            console.warn(`Error 503 recibido. Reintentando (${attempts}/${options.retry}) en ${options.delay}ms...`);
            setTimeout(() => makeRequest(url), options.delay);
          } else {
            reject(new Error(`Error 503: Servicio SWAPI no disponible después de ${options.retry} intentos.`));
          }
          return;
        }

        // Verifica si la respuesta es exitosa
        if (response.statusCode !== 200) {
          reject(new Error(`Error en la solicitud a SWAPI: Código ${response.statusCode}`));
          response.resume(); // Descarta el resto de datos
          return;
        }

        // Almacena los datos que llegan en partes
        response.on('data', (chunk) => {
          data += chunk;
        });

        // Maneja la finalización de la recepción de datos
        response.on('end', () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(translatePersonData(id, parsedData));
          } catch (error) {
            console.error("Error al parsear la respuesta de SWAPI:", error);
            reject(new Error("No se pudo parsear la respuesta de SWAPI"));
          }
        });
      }).on('error', (error) => {
        console.error("Error en la solicitud a SWAPI:", error);
        reject(new Error("Error en la solicitud a SWAPI"));
      });
    };

    // Realiza la primera solicitud
    makeRequest(url);
  });
};

/**
 * Función para traducir los datos de una persona de inglés a español
 * @param {string} id - El ID de la persona
 * @param {Object} data - Datos de la persona en inglés
 * @returns {Object} - Datos de la persona con los campos traducidos al español
 */
const translatePersonData = (id, data) => {
  return {
    id,
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
    url: data.url
  };
};

module.exports = { fetchPersonFromSWAPI };
