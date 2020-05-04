const errorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;
    console.log(JSON.stringify(error).red);

    if(error.name == 'SequelizeUniqueConstraintError') {
        const message = `Record already present`;
        error = new errorResponse(message, 409);
    }

    if(error.name == 'SequelizeValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new errorResponse(message, 400);
    }
    
    res.status(error.statusCode || 500).send({
        success: false,
        message: error.message || 'Server Error'
    });
}

module.exports = errorHandler;