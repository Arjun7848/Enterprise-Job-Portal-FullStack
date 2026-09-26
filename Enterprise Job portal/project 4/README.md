# Enterprise Job Portal (Project 4)

A COMPLETE industry-level Job Portal website built with a modern stack featuring a glassmorphism UI, smooth animations, and a scalable backend.

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios.
- **Backend:** Node.js, Express.js, SQLite.
- **Auth:** JWT, bcrypt.

## Key Features

- **Modern UI:** Glassmorphism, premium typography, and responsive design.
- **Authentication:** Role-based access (Job Seeker, Recruiter, Admin).
- **Job Management:** Post, search, filter, and view jobs.
- **Application Tracking:** Seeker and Recruiter dashboards for tracking status.
- **Premium Dashboards:** Animated stats and interactive data tables.

## Setup Instructions

### 1. Prerequisites
- Node.js installed on your machine.

### 2. Installation
From the root directory (`project 4`), run:
```bash
npm run install:all
```
This will install dependencies for the root, frontend, and backend.

### 3. Environment Setup
Create a `.env` file in the `backend` directory:
```env
PORT=5000
JWT_SECRET=your_super_secret_key_here
```

### 4. Running the Project
From the root directory, run:
```bash
npm start
```
This uses `concurrently` to start both the Express backend (Port 5000) and the Vite frontend (Port 5173). The frontend is configured to proxy `/api` requests to the backend.

## Folder Structure

- `backend/`: Express server, SQLite configuration, routes, and controllers.
- `frontend/`: Vite-React application with Tailwind and Framer Motion.
- `package.json`: Root configuration for managing the monorepo.

## Future Roadmap (Stubs implemented)
- [ ] AI Job Recommendations
- [ ] Resume Builder & ATS Checker
- [ ] Real-time Messaging
- [ ] Interview Scheduling
- [ ] Admin Analytics Panel
- [ ] Subscription & Payment Integration
