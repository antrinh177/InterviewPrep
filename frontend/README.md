## Project Structure

InterviewPrep/
├── backend/
│ ├── modules/
│ │ ├── categories/
│ │ │ ├── middlewares/
│ │ │ │ └── categoryValidation.js
│ │ │ ├── models/
│ │ │ │ └── categoryModel.js
│ │ │ └── routes/
│ │ │ └── categoryRoutes.js
│ │ ├── questions/
│ │ │ ├── middlewares/
│ │ │ │ └── questionValidation.js
│ │ │ ├── models/
│ │ │ │ └── questionModel.js
│ │ │ └── routes/
│ │ │ └── questionRoutes.js
│ │ └── users/
│ │ └── ...
│ ├── shared/
│ │ └── middlewares/
│ │ ├── connect-db.js
│ │ ├── errorHandler.js
│ │ ├── logger.js
│ │ └── notFound.js
│ ├── scripts/
│ │ └── updateCategoriesWithMainCat.js
│ ├── .env
│ ├── server.js
│ └── package.json
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── forms/
│ │ │ │ └── QuestionSearchForm.js
│ │ │ └── Results.js
│ │ ├── services/
│ │ │ └── api.js
│ │ ├── utils/
│ │ │ └── grading.js
│ │ ├── App.js
│ │ └── index.js
│ ├── .env
│ └── package.json
│
└── README.md

## Task Distribution

## Phase 4

### An Trinh

- frontend/src/services/api.js: common code to fetch data from backend
- frontend/src/utils/grading.js: grading system to grade user's answer on percentage for each question based on match keywords.
- frontend/src/pages/Results.js: Display questions based on category and difficulty from forms/QuestionSearchForm.js file and show grade for each answered question after user submit
- frontend/src/utils/localStorage.js: Store completedQuestion object with grade for displaying statistic progress purpose, calculate percentage per main category with formula: Percentage = [(sum of grades) / (total questions * 100)] * 100%
- frontend/src/pages/Home.js: Display user progress on each main category

### Ema Maeda

- backend/modules/categories/routes/categoryRoutes.js: Removed pagination to fetch all categories that meet certain criteria, improving data retrieval for front-end needs
- backend/modules/questions/routes/questionRoutes.js: Added a /search endpoint to allow filtering questions based on specified requirements.
- frontend/src/pages/forms/QuestionSearchForm.js: Implemented a search form that enables users to select questions they want to prepare, enhancing the user experience.
