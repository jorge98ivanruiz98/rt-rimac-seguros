
# RETO TECNICO - Starwars API con Serverless Framework para RIMAC SEGUROS

Este proyecto implementa una API Serverless desplegada en AWS Lambda que interactúa con la API de Star Wars (SWAPI) y almacena datos en DynamoDB.

## Requisitos

- Node.js (v18.x o superior)
- Serverless Framework
- AWS CLI configurado con permisos adecuados en IAM

## Instrucciones de Configuración

1. Clona el repositorio o extrae el archivo .zip del proyecto.
2. Navega al directorio del proyecto.
3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Despliega el proyecto en AWS:

   ```bash
   serverless deploy
   ```

## Endpoints

### GET /characters/{id}

Obtiene un personaje de Star Wars por ID desde SWAPI y traduce los campos al español.

- **Parámetro de Ruta**: `id` - ID del personaje de Star Wars (según SWAPI).
- **Respuesta**:

  ```json
  {
    "nombre": "Luke Skywalker",
    "altura": "172",
    "peso": "77",
    "color_pelo": "blond",
    "color_piel": "fair",
    "color_ojos": "blue",
    "nacimiento": "19BBY",
    "genero": "male",
    "planeta_natal": "https://swapi.py4e.com/api/planets/1/",
    ...
  }
  ```

### POST /characters

Crea un nuevo registro de personaje en DynamoDB. Puedes enviar cualquier dato traducido en el cuerpo de la solicitud.

- **Ejemplo de Cuerpo**:

  ```json
  {
    "id": "1",
    "nombre": "Luke Skywalker",
    "altura": "172",
    "peso": "77",
    "color_pelo": "blond",
    "color_piel": "fair",
    "color_ojos": "blue",
    "nacimiento": "19BBY",
    "genero": "male",
    "planeta_natal": "https://swapi.py4e.com/api/planets/1/",
    "peliculas": ["https://swapi.py4e.com/api/films/1/", "..."],
    ...
  }
  ```

## Configuración de Base de Datos

La tabla de DynamoDB utilizada en este proyecto se llama `RIMAC-PT-DEV`. Asegúrate de que esta tabla exista en tu cuenta de AWS o utiliza la configuración en `serverless.yml` para desplegarla automáticamente.
