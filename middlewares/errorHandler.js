function errorHandler(err, req, res, next) {
    let statusCode
    let message

    if (err.errors?.at(0)?.message == "email must be unique") {
        statusCode = 400
        message = "user with that email already exists"
    } else {
        statusCode = err.status || 500
        message = err.message || 'Internal Server Error'
    }
    
    res.status(statusCode).json({
        message: message,
    });
}

module.exports = errorHandler;