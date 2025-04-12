const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Monkey API',
      version: '1.0.0',
      description: 'API for monkey management system',
    },
    servers: [
      {
        url: 'http://localhost:7000',
        description: 'Development server',
      },
    ],
  },
  apis: [
    path.resolve(__dirname, '../routes/**/*.ts'),
    path.resolve(__dirname, './schemas/**/*.ts'),
  ], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
