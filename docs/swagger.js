
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Koskita API',
            version: '1.0.0',
            description: 'API documentation for Koskita App',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            }
        ],
        servers: [
            {
                url: 'https://t04pzf6r-3000.asse.devtunnels.ms', // sesuai base URL server
            },
            {
                url: 'http://localhost:3000', // sesuai base URL server
            },
        ],
    },
    apis: ['./routes/*.js', './controllers/*.js'], // lokasi file dengan anotasi Swagger (pakai JSDoc-style)
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
module.exports = swaggerSpec;