//App-level Middlewares
//Handle internal server error

const errorHandler = (err, red, res, next) => {
    console.log(err.stack);
    res.status(500).json({error: 'Internal Server Error'})
}

module.exports = errorHandler;