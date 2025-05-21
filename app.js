require('dotenv').config()
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./docs/swagger')
const express = require('express')
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('[:date] :method :url :status :response-time ms',))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api', routes)

app.use(errorHandler)

module.exports = app