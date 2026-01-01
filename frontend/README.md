# InterviewPrep Frontend

## Overview
The InterviewPrep frontend is a modern, responsive React application for practicing interview questions, tracking user progress, and managing users through an admin dashboard. It features secure authentication with OTP verification, dynamic question search and filtering, and a user-friendly interface designed for both candidates and administrators.

## Features
- Email/password login with OTP verification
- Protected routes for authenticated users
- Admin dashboard: view, create, update, and delete users
- User registration and account management
- User progress tracking and local storage persistence
- Search, filter, and paginate questions by category and difficulty
- Responsive design with custom CSS modules
- Seamless integration with backend APIs

## Tech Stack
- React
- Axios (API requests)
- React Router (routing and navigation)
- CSS Modules (component-scoped styling)
- LocalStorage (client-side persistence)

## Setup Instructions
1. Install dependencies:
	```bash
	npm install
	```
2. Create a `.env` file and set the backend API URL if needed:
	```env
	REACT_APP_HOSTNAME=localhost
	REACT_APP_PORT=3001
	```
3. Start the development server:
	```bash
	npm start
	```
4. The app will run at [http://localhost:3000](http://localhost:3000)

## Project Structure
- `src/pages/` - Main pages (Home, Login, SignUp, AdminDashboard, etc.)
- `src/components/` - Reusable components (ProtectedRoute, etc.)
- `src/services/` - API service layer
- `src/styles/` - CSS files
- `src/utils/` - Utility functions