//App-level Middlewares
//Track what requests are being made 

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`); //sample log: GET /api/questions
    next();
}

module.exports = logger;