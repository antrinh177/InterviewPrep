# InterviewPrep

## Overview - Phase2

We designed the data structure adding sample data and implementing a modular Express.js architecture. We applied CRUD logic and modular routes for managing questions, users and categories, and middlewares and input validation to create a well-structured backend.

## Project Structure

```
InterviewPrep
├── data
│   ├── questions.json
│   ├── users.json
│   └── categories.json
├── modules
│   ├── questions
│   │   ├── models
│   │   │   └── questionModel.js
│   │   ├── routes
│   │   │   └── questionRoutes.js
│   │   └── middlewares
│   │       └── questionValidation.js
│   ├── users
│   │   ├── models
│   │   │   └── userModel.js
│   │   ├── routes
│   │   │   └── userRoutes.js
│   │   └── middlewares
│   │       └── userValidation.js
│   └── categories
│       ├── models
│       │   └── categoryModel.js
│       ├── routes
│       │   └── categoryRoutes.js
│       └── middlewares
│           └── categoryValidation.js
├── middlewares
│   ├── errorHandler.js
│   ├── notFound.js
│   └── logger.js
├── scripts
│   └── generateCategories.js
├── utils
│   └── fileHandler.js
├── server.js
├── package.json
└── README.md
```

## Features

- **CRUD Operations**: Create, Read, Update, and Delete operations for questions, users, and categories
- **Modular Architecture**: Organized into feature-based modules (categories, questions, and users) for better maintainability
- **Data Validation**: Input validation using express-validator to ensure data integrity
- **Error Handling**: Centralized error handling and 404 Not Found responses
- **Logging**: Middleware for logging incoming requests for debugging purposes

## Setup Instructions

1. Clone the repository:

   ```
   git clone https://github.com/antrinh177/InterviewPrep.git
   cd InterviewPrep
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the server:

   ```
   npm start
   ```

4. Access the API at `http://127.0.0.1:3000`.

## Usage Examples

- **Get all questions**: `GET /questions`
- **Get a question by ID**: `GET /questions/:id`
- **Add a new question**: `POST /questions` with JSON body
- **Update a question**: `PUT /questions/:id` with JSON body
- **Delete a question**: `DELETE /questions/:id`

## Testing

We used Postman to test the API endpoints. Ensure all CRUD operations work as expected and validate error handling.

## Task Distribution

### An Trinh

- data/questions.json
- middlewares/\*
- modules/questions/\*
- utils/\*
- server.js

### Ema Maeda

- data/categories.json
- data/users.json
- modules/categories/\*
- modules/users/\*
- scripts/\* (to generate categories.json)
- README.md
