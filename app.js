require('dotenv').config()
const morgan = require('morgan')
const morganBody = require('morgan-body');
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./docs/swagger')
const cors = require('cors');
const express = require('express')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const app = express()

//  bypass CORS issues in development
app.use(cors());

//  parse application/json and application/x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//  logging middleware
morganBody(app, {
    noColors: false,
    prettify: true,
    stream: process.stdout, 
});

// swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// routes
app.use('/api', routes)

// error handling middleware
app.use(errorHandler)

module.exports = app