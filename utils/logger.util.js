const morgan = require('morgan')
const winston = require('winston')
const fs = require('fs')

const info_log = fs.createWriteStream('../logs/requests.log')

const format = winston.format.combine(
    winston.format.colorize(),  
    winston.format.json() 
)

const info_logger = winston.createLogger({
    level : 'info' ,
    format,
    transports : [
        new winston.transports.Console({format : winston.format.timestamp()}),
        new winston.transports.File({filename : '../logs/requests.log'})
    ]

})

const error_logger = winston.createLogger({
    level : "error",
    format,
    transports : [
        new winston.transports.Console(),
        new winston.transports.File({filename : '../logs/errors.log'})
    ]
})


module.exports = {info_logger , error_logger}