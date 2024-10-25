const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Jobs API Documentation',
    version: '1.0.0',
    description: 'API documentation for the Jobs API',
  },
  servers: [
    {
      url: 'https://jobs-api-9z7l.onrender.com',
      description: 'Production Server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to the API docs in the routes folder
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
