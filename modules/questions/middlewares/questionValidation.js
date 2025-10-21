//Middlewares to validate questions
const {body, validationResult} = require('express-validator');

const questionValidation = [
    body('id')
        .notEmpty().withMessage('ID is required')
        .custom((value) => {
            if (typeof value === 'string'){
                throw new Error ('ID must be a number, not a string');
            }
            return true
        })
        .isInt().withMessage('ID must be an integer'),
    body('category').notEmpty().withMessage('Category is required'),
    body('difficulty')
        .notEmpty().withMessage('Difficulty is required')
        .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy/Medium/Hard'),
    body('question').notEmpty().withMessage('Question value is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next();
    }
]

module.exports = questionValidation;