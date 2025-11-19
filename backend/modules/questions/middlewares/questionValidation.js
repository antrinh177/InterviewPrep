//Middlewares to validate questions
const {body, validationResult} = require('express-validator');

const questionValidation = [
    body('Category').notEmpty().withMessage('Category is required'),
    body('Difficulty')
        .notEmpty().withMessage('Difficulty is required')
        .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy/Medium/Hard'),
    body('Question').notEmpty().withMessage('Question value is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]

module.exports = questionValidation;