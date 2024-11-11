
# Proyecto de API REST con AWS Lambda, API Gateway, DynamoDB RETO TÉCNICO RIMAC SEGUROS

Este proyecto implementa una API REST en AWS utilizando Lambda, API Gateway, y DynamoDB, con validación de solicitudes JSON mediante `Ajv`, documentación de Swagger UI, y despliegue con Serverless.

## Requisitos Previos

- **Node.js** (versión recomendada: 16.x o superior)
- **AWS CLI** configurado
- **Serverless Framework**

## Instalación

### Paso 1: Instalar Node.js y npm (si no están instalados)

Visita [Node.js](https://nodejs.org/) para descargar e instalar la versión recomendada. Esto instalará tanto `node` como `npm` en tu máquina.

### Paso 2: Instalar AWS CLI (si no está instalado)

Descarga e instala la AWS CLI desde [AWS CLI](https://aws.amazon.com/cli/).

Configura el AWS CLI con tus credenciales:

```bash
aws configure
```

### Paso 3: Instalar Serverless Framework

Si no tienes Serverless instalado, instálalo globalmente:

```bash
npm install -g serverless
```

### Paso 4: Clonar el Repositorio y Navegar al Proyecto

Clona el repositorio y navega a la carpeta del proyecto:

### Paso 5: Instalar las Dependencias del Proyecto

Instala las dependencias del proyecto localmente usando npm:

```bash
npm install
```

## Estructura del Proyecto

```plaintext
├── src/
│   ├── handlers/
│   │   ├── getPeople.js          # Función Lambda para obtener datos de personas
│   │   └── createPeople.js       # Función Lambda para crear personas
│   ├── schemas/
│   │   └── request.jsonBody.json # Esquema de validación JSON para createPeople
│   ├── services/
│   │   ├── dynamoService.js      # Servicio para interacción con DynamoDB
│   │   └── swapiService.js       # Servicio para consumir la API externa SWAPI
│   └── utils/
│       ├── responseBuilder.js    # Función de utilidades para respuestas HTTP
│       └── Constants.js          # Códigos de estado de las respuestas HTTP
├── config.json                   # Configuración del proyecto
├── serverless.yml                # Archivo de despliegue de Serverless
└── README.md                     # Documentación del proyecto
```

## Configuración del Proyecto

### Dependencias

Las dependencias se encuentran en el archivo `package.json`:

```json
{
  "dependencies": {
    "ajv": "^8.17.1",
    "aws-sdk": "^2.1692.0",
    "express": "^4.21.1",
    "swagger-ui-express": "^5.0.1",
    "yamljs": "^0.3.0"
  },
  "devDependencies": {
    "serverless-aws-documentation": "^1.1.0"
  }
}
```

### Archivo de Configuración `config.json`

Define los parámetros principales del despliegue en `config.json`. Ejemplo:

```json
{
  "Parameters": {
    "projectValue": "API-RetoTecnico",
    "LambdaFunctionPR-GetItem": "RIMAC-Get-Item",
    "LambdaFunctionPR-CreateItem": "RIMAC-Create-Item",
    "APIGatewayName": "API-Gateway-RetoTecnico",
    "DYNAMODB_TABLE": "PeopleTable",
    "TIMEOUT": 10,
    "MemorySize": 1024,
    "SWAPI_URL": "https://swapi.py4e.com/api/"
  }
}
```

### Archivo de Despliegue `serverless.yml`

El archivo `serverless.yml` define la configuración del despliegue para Lambda y API Gateway. Contiene:

- Configuración de las funciones `getPeopleFunction` y `createPeopleFunction`, que manejan los métodos `GET` y `POST` en `/people`.
- Creación automática de la tabla DynamoDB.
- Configuración de los permisos necesarios.

## Servicios

### `dynamoService.js`

Este archivo contiene funciones para interactuar con DynamoDB, como la inserción y consulta de datos.

### `swapiService.js`

Este archivo contiene la lógica para consumir la API externa de People (SWAPI).

## Utilidades

### `Constants.js`

Archivo de constantes que define los códigos de estado HTTP para las respuestas de la API.

### `responseBuilder.js`

Utiliza `Constants.js` para construir respuestas de la API con los códigos de estado apropiados.

## Pasos para el Despliegue

1. **Despliegue en AWS**

   Despliega el proyecto en AWS usando Serverless.

   ```bash
   serverless deploy
   ```

   Este comando:
   - Crea las funciones Lambda para los métodos `GET` y `POST` en `/people`.
   - Configura la API en API Gateway.
   - Crea la tabla DynamoDB `PeopleTable`.

2. **Endpoints de la API**

   Después del despliegue, Serverless muestra las URLs de los endpoints de API Gateway. Ejemplo de endpoints:

   - `GET /people`: Recupera información de una persona.
   - `POST /people`: Crea un registro de una persona.

## Validación de JSON en `createPeople`

La función `createPeople` utiliza `Ajv` para validar el cuerpo de la solicitud conforme a las reglas definidas en `src/schemas/request.jsonBody.json`.

## Documentación de la API con Swagger

### Despliegue de la Documentación Localmente

1. **Iniciar el Servidor Local para Swagger UI**

   Si deseas ver la documentación Swagger de la API en tu máquina local:

   - Asegúrate de tener el archivo `swagger.yml` en `docs/`.
   - Usa el siguiente código en `server.js` para iniciar un servidor Express y servir Swagger UI.

   ```javascript
   const express = require('express');
   const swaggerUi = require('swagger-ui-express');
   const YAML = require('yamljs');
   const path = require('path');

   const app = express();
   const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yml'));

   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

   const PORT = 3000;
   app.listen(PORT, () => {
     console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
   });
   ```

2. **Ejecutar el Servidor**

   ```bash
   node server.js
   ```

3. **Acceder a la Documentación Swagger UI**

   Abre `http://localhost:3000/api-docs` en tu navegador para ver la documentación interactiva.

## Recursos

- **Serverless Framework**: https://www.serverless.com
- **AWS Lambda**: https://aws.amazon.com/lambda/
- **API Gateway**: https://aws.amazon.com/api-gateway/
- **DynamoDB**: https://aws.amazon.com/dynamodb/
- **Ajv**: https://ajv.js.org/
- **Swagger UI**: https://swagger.io/tools/swagger-ui/
