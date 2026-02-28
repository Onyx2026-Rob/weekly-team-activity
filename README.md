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

## Quick Start (Docker — Recommended)

Run the entire application (database + backend + frontend) with a single command:

```bash
docker-compose up --build
```

Then open **http://localhost:3000** in your browser.

> Migrations and seed data (Gino Motyka, Todd Allen, Nikhal Bele) are applied automatically on first startup.

To stop: `docker-compose down`  
To stop and remove data: `docker-compose down -v`

---

## Manual Setup Instructions

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

The backend has a Jest unit test suite covering all three service layers.

```bash
cd backend
npm install       # first time only
npm test          # run all tests
```

To run tests in watch mode (re-runs on file save):

```bash
cd backend
npm run test:watch
```

To generate a coverage report:

```bash
cd backend
npm run test:cov
```

### What is tested

| File | Tests |
|------|-------|
| `activities/activities.service.spec.ts` | Create activity, delete activity, DTO validation (percentComplete range, required title) |
| `activities/activities.controller.spec.ts` | POST create activity, DELETE remove activity, NotFoundException propagation |
| `employees/employees.service.spec.ts` | List all employees, find by ID, not-found error |
| `employees/employees.controller.spec.ts` | GET all employees, GET employee by ID, NotFoundException propagation |
| `weekly-reports/weekly-reports.service.spec.ts` | List reports for employee, find by ID, find-or-create (new & existing), not-found errors |
| `weekly-reports/weekly-reports.controller.spec.ts` | GET reports for employee, GET report by ID, POST find-or-create, NotFoundException propagation |

## Activity Fields

- **title** (required): Activity name
- **description**: What was worked on
- **roadblocks**: Any blockers or impediments
- **percentComplete**: Integer from 0 to 100
