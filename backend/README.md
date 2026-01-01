# InterviewPrep Backend

## Overview
The InterviewPrep backend is a Node.js/Express application that provides RESTful APIs for user authentication (including OTP email verification), account management, question and category CRUD operations with search and pagination, and admin features. Designed with a modular architecture, it ensures maintainability, validation, and integration with the frontend.

## Features
- Full CRUD operations for questions, users, and categories
- Modular, feature-based folder structure for scalability
- Data validation using express-validator
- Role-based access control (admin/user)
- OTP-based email verification for registration/login
- JWT token generation and authentication
- Secure password hashing with bcrypt
- Google OAuth2-based email sending (for OTP)
- Centralized error handling and logging
- CORS enabled for frontend-backend integration

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JWT (jsonwebtoken)
- bcrypt (password hashing)
- express-validator (input validation)
- dotenv (environment variables)
- cors (Cross-Origin Resource Sharing)
- Google APIs (googleapis for sending email via Gmail)

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your MongoDB URI and other secrets:
   ```env
   MONGODB_URI=mongodb://localhost:27017/interviewprep
   JWT_SECRET=your_jwt_secret
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
4. The API will run at [http://localhost:3001](http://localhost:3001)

## Project Structure
- `modules/` - Feature modules (questions, users, categories)
- `shared/middlewares/` - Common middlewares (connect-db, errorHandler, etc.)
- `utils/` - Helper functions


## Usage Examples
- Get all questions: `GET /questions`
- Get all questions with search, sort, pagination : `GET /questions?search={keyword}&category={category}&difficulty={level}&sort={field}&page={number}&limit={items}`
- Get a question by ID: `GET /questions/:id`
- Add a new question: `POST /questions` with JSON body
- Update a question: `PUT /questions/:id` with JSON body
- Delete a question: `DELETE /questions/:id`

## Testing
We used Postman to test the API endpoints. Ensure all CRUD operations work as expected and validate error handling.