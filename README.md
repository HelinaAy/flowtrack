# 🌸 FlowTrack – Menstrual Cycle & Wellness Tracker

A full-stack menstrual cycle planner and wellness tracking application built with **React.js, Node.js, Express.js, and MySQL**.

FlowTrack helps users track their menstrual cycles, monitor daily symptoms and moods, understand cycle patterns, and receive personalized wellness recommendations based on their current cycle phase.

## 👩‍💻 Author

**Hilina Ayalew**

Final Individual Capstone Project – WabiSkills Full-Stack Development Bootcamp.

## 🚀 Live Demo

- **Live Application:** https://flowtrack-1dvd.vercel.app/
- **Backend API:** https://flowtrack-3.onrender.com/
- **Project Demo Video:** [Watch on Google Drive](https://drive.google.com/file/d/1UWCQ-R54quJLRX5xKqjHyy3bWWkHR4DU/view?usp=sharing)

## 📌 Project Overview

Many people who menstruate do not consistently track their menstrual cycles, making it difficult to identify patterns, monitor recurring symptoms, or understand changes in their cycle.

FlowTrack addresses this challenge by providing an easy-to-use digital platform where users can record daily cycle information and visualize their health and wellness patterns over time.

The application combines cycle tracking, data visualization, and phase-based wellness guidance in one platform.

## ✨ Features

### 🔐 Secure Authentication
- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected routes for authenticated users.

### 📊 Smart Dashboard
- Current menstrual cycle phase indicator.
- Countdown to the next predicted period.
- Fertile window estimation.
- Cycle length trends and statistics.

### 📅 Interactive Calendar
- Monthly calendar view.
- Color-coded period, fertile, and predicted days.
- Select calendar dates to log daily information.

### 📝 Daily Cycle Logging
- Track menstrual flow (none, light, medium, heavy).
- Record daily mood.
- Monitor symptoms.
- Add personal notes.
- View recent logging history.

### 📈 Insights & Analytics
- Cycle length trend visualization.
- Symptom frequency analysis.
- Summary statistics.
- Visual representation of recorded cycle patterns.

### 🌿 Personalized Wellness Guidance
Phase-based recommendations covering:
- Nutrition.
- Exercise and physical activity.
- Hydration.
- Self-care.
- Stress management.

### 🎨 User Experience
- Dark and light theme modes.
- Responsive design for desktop, tablet, and mobile.
- Reusable React components.
- Intuitive navigation and interactive interface.

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- React Router DOM
- Axios
- Bootstrap 5
- Custom CSS and CSS variables
- Recharts
- react-calendar
- React Context API

### Backend
- Node.js
- Express.js
- JSON Web Tokens (JWT)
- bcrypt
- mysql2
- dotenv
- CORS

### Database
- MySQL
- MySQL Workbench

### Deployment
- Vercel – Frontend hosting.
- Render – Backend hosting.
- MySQL – Database hosting.

## 🗄️ Database Schema

FlowTrack uses a relational MySQL database with three main tables.

### 1. Users

| Column | Type | Description |
|---|---|---|
| id | INT, Primary Key, Auto Increment | Unique user ID |
| name | VARCHAR(100) | User's name |
| email | VARCHAR(100), UNIQUE | User's email |
| password | VARCHAR(255) | Hashed password |
| created_at | TIMESTAMP | Account creation date |

### 2. Cycles

| Column | Type | Description |
|---|---|---|
| id | INT, Primary Key, Auto Increment | Cycle record ID |
| user_id | INT, Foreign Key | References users(id) |
| last_period_date | DATE | Last menstrual period date |
| cycle_length | INT | Cycle length (default: 28 days) |
| period_length | INT | Period duration (default: 5 days) |

### 3. Logs

| Column | Type | Description |
|---|---|---|
| id | INT, Primary Key, Auto Increment | Log record ID |
| user_id | INT, Foreign Key | References users(id) |
| log_date | DATE | Date of the entry |
| flow | ENUM | none, light, medium, heavy |
| mood | VARCHAR(50) | Recorded mood |
| symptoms | TEXT | Recorded symptoms |
| notes | TEXT | Additional notes |

**Database relationships:** The `cycles` and `logs` tables reference the `users` table through `user_id`. Foreign key relationships use `ON DELETE CASCADE`.

## 📂 Project Structure

```text
flowtrack/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── flowtrack-frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## ⚙️ Getting Started

Follow these steps to run FlowTrack locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm.
- MySQL Server.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/HelinaAy/flowtrack.git
cd flowtrack
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=flowtrack_db
DB_PORT=3306
JWT_SECRET=your_private_jwt_secret
```

Replace the database values with your own MySQL credentials.

Start the backend:

```bash
npm start
```

For development:

```bash
npm run dev
```

### 3. Set Up the Frontend

Open another terminal:

```bash
cd flowtrack-frontend
npm install
```

Configure the Axios API base URL in your frontend API configuration to point to your local backend:

```javascript
baseURL: 'http://localhost:5000/api'
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the Application

Visit the local development URL provided by Vite, usually:

```text
http://localhost:5173
```

## 🔒 Security

- Passwords are hashed before being stored in the database.
- JWT tokens are used for authentication.
- Protected backend routes require valid authentication.
- Sensitive environment variables are stored outside the source code.
- Database credentials and private secrets should never be committed to GitHub.

## 🎯 Project Goals

FlowTrack was developed to demonstrate practical full-stack development skills, including:

- Building responsive user interfaces with React.
- Developing RESTful APIs using Node.js and Express.
- Designing and managing relational databases with MySQL.
- Implementing authentication and authorization.
- Integrating frontend and backend services.
- Visualizing user data through charts and analytics.
- Deploying a full-stack application to cloud platforms.

## 🔮 Future Improvements

- More advanced cycle prediction algorithms.
- Exportable cycle and wellness reports.
- Additional data visualization and trend analysis.
- Personalized recommendations based on historical tracking data.
- Optional reminders and notifications.

## ⚠️ Disclaimer

FlowTrack is intended for personal cycle tracking and general wellness education. Cycle and fertile-window predictions are estimates, not medical diagnoses or reliable contraception guidance. Users should consult qualified healthcare professionals for medical concerns.

---

## ❤️ Acknowledgment

Built with dedication by **Hilina Ayalew** as an individual capstone project for the **WabiSkills Full-Stack Development Bootcamp**.

**Thank you for exploring FlowTrack! 🌸**
