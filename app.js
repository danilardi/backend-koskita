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
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
morganBody(app, {
    noColors: false,
    prettify: true,
    stream: process.stdout, 
});
// app.use(morgan('[:date] :method :url :status :response-time ms',))

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api', routes)

app.use(errorHandler)


module.exports = app