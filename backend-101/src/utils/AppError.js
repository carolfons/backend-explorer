class AppError{
    message;
    statusCode;

    constructor(message,statusCode = 400){
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = AppError;

// $ npm install express-async-errors --save