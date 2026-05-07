# Sales Performance Tracker PRO

A premium Full-Stack application that transforms raw sales data into actionable insights using Flask, React, and Pandas.

## Features
- **Secure Authentication**: JWT-based user login and registration.
- **Data Intelligence Hub**: Upload CSV/Excel files for automated cleaning and processing.
- **Interactive Dashboard**: KPI cards and real-time charts powered by Chart.js.
- **Premium Design**: Modern "Corporate Dark" aesthetic with glassmorphism.

## Tech Stack
- **Backend**: Flask, SQLAlchemy, Pandas, JWT
- **Frontend**: React, Vite, TailwindCSS, Chart.js, Lucide-React
- **Database**: SQLite (Production-ready for Render)

## Local Setup

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python app.py`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Deployment to Render
1. Push this code to your GitHub repository: `https://github.com/B-ramgharia/Sales-Performance-Tracker..git`
2. Connect your GitHub account to [Render](https://render.com).
3. Create a new **Web Service**.
4. Render will automatically detect the `render.yaml` file and configure the service.
5. Set the `JWT_SECRET_KEY` environment variable in Render's dashboard.

## Deployment to GitHub Pages (Optional Frontend Only)
Note: GitHub Pages only supports static content. To deploy the full app, use Render.
1. `cd frontend`
2. `npm run build`
3. Deploy the `dist` folder.
