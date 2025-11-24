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

### Ema Maeda
