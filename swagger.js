const swaggerAutogen = require('swagger-autogen')();
const params = 
 ['./app.js']
;

const Swagger = swaggerAutogen('./swagger.json',params);

module.exports = Swagger;

// app.js:


const swaggerUi = require('swagger-ui-express');
const Swagger = require('./swagger.json');



app.use('/documentation', swaggerUi.serve, swaggerUi.setup(Swagger));


