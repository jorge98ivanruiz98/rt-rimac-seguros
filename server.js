// server.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

// Cargar el archivo OpenAPI en YAML
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yml'));

// Configura el endpoint de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Inicia el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Documentación Swagger disponible en: http://localhost:${PORT}/api-docs`);
});
