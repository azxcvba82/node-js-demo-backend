const swaggerAutogen = require('swagger-autogen')();

const outputFile = './src/swagger_output.json';
const endpointsFiles = ['./src/app.js'];

const doc = {
  tags: [ // by default: empty Array
    {
      name: "Auth",
      description: ""
    },
    {
      name: "Users",
      description: ""
    },
  ],
}

swaggerAutogen(outputFile, endpointsFiles, doc);