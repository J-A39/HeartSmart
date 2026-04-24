# HeartSmart

A web application for predicting Coronary Artery Disease (CAD) risk and helping users learn about heart health. Built as a final year project for BSc Computer Science at the University of Westminster.

https://heartsmart.onrender.com/ is my hosted website.

## What it does

HeartSmart lets users enter their health details (age, BMI, blood pressure, cholesterol, etc.) and get a personalised risk prediction powered by a machine learning model trained on the Framingham Heart Study dataset. Users can also track their medications and exercise, view their risk history over time, and learn about heart disease through short topics and quizzes.

Key features:

- Risk prediction with confidence levels and risk bands
- Support for unknown values (uses population averages when a user doesn't know their blood pressure, cholesterol, or glucose)
- Medication and exercise logbook
- Risk history with progress chart
- Knowledge section with quizzes
- Dark mode
- Data export and account deletion (GDPR compliance)

## Tech stack

- **Frontend:** React (Vite), plain CSS with custom properties
- **Backend API:** Express.js, MongoDB Atlas (Mongoose), JWT authentication
- **ML Service:** FastAPI, scikit-learn, joblib
- **Deployment:** Render (free tier)

## Project structure

```
HeartSmart/
├── client/            React frontend
│   └── src/
│       ├── pages/     AssessmentPage, LogbookPage, HistoryPage, KnowledgePage, SettingsPage
│       ├── ui/        Reusable components (Field, Select, OptionalNumber, RiskChart)
│       └── data/      Knowledge topics and quiz questions
├── server/            Express.js API
│   ├── models/        Mongoose schemas (User, Logbook, RiskAssessment, QuizAttempt)
│   ├── routes/        API routes (auth, risk, logbook, history, quiz, userData)
│   ├── middleware/     JWT auth middleware
│   └── utils/         Helper functions
├── ml-service/        FastAPI ML microservice
│   ├── src/           Predictor logic, risk utilities, guardrails
│   └── models/        Trained model file (.pkl)
├── data/              Framingham dataset
└── notebooks/         Model training notebooks
```

## Running it locally

You'll need Node.js, Python 3, and a MongoDB Atlas cluster (or a local MongoDB instance).

**1. Clone the repo**

```
git clone https://github.com/your-username/HeartSmart.git
cd HeartSmart
```

**2. Set up the ML service**

```
cd ml-service
python -m venv venv
venv\Scripts\activate        (Windows)
source venv/bin/activate     (Mac/Linux)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**3. Set up the Express API**

Open a new terminal:

```
cd server
npm install
```

Create a `.env` file in the server folder:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_random_string
ML_SERVICE_URL=http://localhost:8000
```

Then start it:

```
node index.js
```

**4. Set up the React frontend**

Open another terminal:

```
cd client
npm install
```

Create a `.env` file in the client folder:

```
VITE_API_BASE=http://localhost:5000
```

Then start it:

```
npm run dev
```

The app should now be running at `http://localhost:5173`.

## API routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Create a new account |
| `/api/auth/login` | POST | Log in and receive a JWT |
| `/api/risk` | POST | Submit health data and get a risk prediction |
| `/api/logbook` | GET | Retrieve the user's logbook |
| `/api/logbook` | PUT | Update medications and exercises |
| `/api/history` | GET | Get past risk assessments |
| `/api/quiz` | GET | Get past quiz attempts |
| `/api/quiz` | POST | Save a quiz attempt |
| `/api/user/export` | GET | Export all user data as JSON |
| `/api/user/delete` | DELETE | Permanently delete account and all data |

All routes except register and login require a valid JWT in the Authorization header.

## Environment variables

**Server (.env)**

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `ML_SERVICE_URL` | URL of the FastAPI ML service |

**Client (.env)**

| Variable | Purpose |
|---|---|
| `VITE_API_BASE` | URL of the Express API |

## Deployment

The app is deployed on Render as three separate services:

- **Static Site** for the React frontend
- **Web Service** for the Express API
- **Web Service** for the FastAPI ML service

The free tier means services sleep after 15 minutes of inactivity, so the first request after a period of inactivity will be slower than usual.

## Author

Junayed Ahmed (w2046276) — University of Westminster, 2025/26
