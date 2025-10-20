# Board App Frontend

A React-based frontend application for managing cards/tasks with a beautiful and responsive UI.

## Features

- Card management interface with create, read, update, delete operations
- Authentication system with login and registration
- Status indicators for cards (todo, doing, done)
- Search functionality for filtering cards
- Pagination for large card collections
- Sample card generation for testing
- Responsive design using React Bootstrap
- JWT-based authentication integration

## Tech Stack

- React 19
- TypeScript
- Bootstrap 5 with React Bootstrap components
- Styled Components for custom styling
- Axios for API requests

## Project Structure

```
board-app/
├── src/
│   ├── components/    # React components
│   ├── services/      # API and authentication services
│   ├── utils/         # Utility functions
│   ├── App.js         # Main application component
│   └── index.js       # Application entry point
├── public/            # Static assets
└── package.json       # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Backend API running (see card-app backend)

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

The application will be available at http://localhost:3001

### Building for Production

```bash
npm run build
```

This will create a `build` directory with optimized production files.

## Docker Deployment

This application can be run as part of a containerized stack using Docker Compose. See the `card-app/application-docker` directory for the complete Docker setup.

```bash
cd card-app/application-docker
docker-compose up -d
```

## Authentication

The application uses JWT-based authentication:

- Default admin user: username: 'admin', password: 'admin'
- JWT tokens are stored in localStorage
- Protected routes require authentication
- Role-based authorization for admin operations

## Token Lifecycle

```bash
Login → Store Token → API Calls (with token) → Token Expires → 401 Response → Logout → Redirect to Login
```

### Token Storage Strategy

- Keep using localStorage (acceptable for SPAs without sensitive data)
- Add httpOnly cookies for refresh tokens (future enhancement)
- Implement token rotation on each API call

## Component Architecture

- Parent-child component relationship with proper data flow
- API calls centralized in parent components
- Presentational components for UI rendering
- State management using React hooks

## Development Notes

- The application runs on port 3001 to avoid conflicts with the backend
- API requests are directed to http://localhost:3000/api
- Live code changes are supported when running in Docker
