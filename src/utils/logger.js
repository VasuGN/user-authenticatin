const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');
const { combine, timestamp, prettyPrint } = format;
require('winston-daily-rotate-file');

// Create the main logger instance
const logger = createLogger({
    level: 'error', // Set the logging level to 'error'
    format: combine(
        timestamp({
            format: "MMM-DD-YYYY HH:mm:ss", // Define the timestamp format
        }),
        prettyPrint() // Enable pretty printing of log messages
    ),
    transports: [
        new transports.DailyRotateFile({
            filename: 'logs/error/error-%DATE%.log', // Define the log file path with date pattern
            datePattern: 'YYYY-MM-DD', // Define the date pattern for log file rotation
            maxFiles: '15d' // Define the maximum number of log files to keep
        }),
    ]
});

// Create the middleware for logging HTTP requests
const httpMethod = expressWinston.logger({
    transports: [
        new transports.DailyRotateFile({
            filename: 'logs/access/access-%DATE%.log', // Define the log file path with date pattern
            datePattern: 'YYYY-MM-DD', // Define the date pattern for log file rotation
            maxFiles: '15d' // Define the maximum number of log files to keep
        })
    ],
    format: combine(
        timestamp({
            format: "MMM-DD-YYYY HH:mm:ss", // Define the timestamp format
        }),
        prettyPrint() // Enable pretty printing of log messages
    ),
    meta: true, // Include additional metadata in logs (e.g., request method, URL, etc.)
    msg: 'HTTP {{req.method}} {{req.url}}', // Log message template
    expressFormat: true, // Use the standard Express.js morgan logger format
    colorize: false, // Disable log colorization
});

module.exports = { logger, httpMethod };
