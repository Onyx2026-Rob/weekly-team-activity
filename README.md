# Weekly Team Activity Tracker

A full-stack internal web application for tracking weekly employee activities.

## Tech Stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL (via Docker)
- **ORM**: TypeORM

## Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose

## Setup Instructions

### 1. Start the Database

```bash
docker-compose up -d
```

This starts a PostgreSQL 15 instance on port 5432.

### 2. Configure Backend Environment

```bash
cp backend/.env.example backend/.env
```

The default values work with the docker-compose setup.

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Run Migrations

```bash
cd backend
npm run migration:run
```

### 5. Seed the Database

```bash
cd backend
npm run seed
```

This creates three employees:
- Gino Motyka
- Todd Allen
- Nikhal Bele

### 6. Start the Backend

```bash
cd backend
npm run start:dev
```

The backend runs on http://localhost:3001

### 7. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 8. Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend runs on http://localhost:3000

## Project Structure

```
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── activities/         # Activities module
│   │   ├── employees/          # Employees module
│   │   ├── weekly-reports/     # Weekly Reports module
│   │   ├── database/
│   │   │   ├── migrations/     # DB migrations
│   │   │   ├── seeds/          # Seed scripts
│   │   │   └── data-source.ts  # TypeORM DataSource config
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── api/                # API client functions & types
│   │   ├── components/         # React components
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employees | List all employees |
| GET | /api/employees/:id | Get employee by ID |
| GET | /api/employees/:employeeId/weekly-reports | List weekly reports for employee |
| GET | /api/weekly-reports/:id | Get single weekly report with activities |
| POST | /api/weekly-reports | Find or create weekly report |
| POST | /api/weekly-reports/:id/activities | Create activity |
| DELETE | /api/activities/:id | Delete activity |

## Running Tests

```bash
cd backend
npm test
```

## Activity Fields

- **title** (required): Activity name
- **description**: What was worked on
- **roadblocks**: Any blockers or impediments
- **percentComplete**: Integer from 0 to 100
Tracks Team Activity Weekly
