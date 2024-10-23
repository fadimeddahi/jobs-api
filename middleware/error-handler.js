const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again',
  }


  if(err.name === 'ValidationError'){
    customError.statusCode = 400
    const errors = Object.values(err.errors).map(item => item.message)
    customError.msg = `Validation Error: ${errors.join('. ')}`
  }
  if(err.name === 'CastError'){
    customError.statusCode = 400
    customError.msg = `Cast Error: ${err.message}`
  }

 if(err.code && err.code === 11000){
    customError.statusCode = 400
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)}`
  }

  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
