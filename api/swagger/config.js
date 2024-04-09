const swaggerJSDoc = require('swagger-jsdoc');
const openapi = require('./openapi.json');

const swaggerDefinition = openapi;

const options = {
  swaggerDefinition,
  apis: ['./routes/*.router.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
