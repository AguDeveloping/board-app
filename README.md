# Board App

A React-based personal productivity dashboard for managing tasks and projects with customizable cards and a beautiful, responsive UI.

## Features

### Core Functionality
- **Card Management**: Complete CRUD operations for task cards
- **Project Organization**: Group cards by projects with dedicated project view
- **Status Tracking**: Three-state workflow (todo, doing, done) with visual indicators
- **Search & Filtering**: Real-time search functionality and status-based filtering
- **Dashboard Views**: Multiple view modes including All Cards, Project-specific, and Statistics
- **Pagination**: Efficient handling of large card collections

### User Experience
- **Authentication System**: JWT-based login and registration with session monitoring
- **Responsive Design**: Mobile-first approach using React Bootstrap
- **Toast Notifications**: User-friendly feedback for all operations
- **Sample Data Generation**: Built-in sample card creation for testing
- **Real-time Updates**: Live data synchronization across components

### Technical Features
- **Session Management**: Automatic token validation and session monitoring
- **Performance Optimization**: Memoized components and callbacks to prevent unnecessary re-renders
- **Environment Configuration**: Separate development and production configurations
- **Docker Support**: Containerized deployment ready

## Tech Stack

- **Frontend**: React 19 with modern hooks and functional components
- **Styling**: Bootstrap 5 + React Bootstrap components + Styled Components
- **Routing**: React Router DOM v7 for SPA navigation
- **HTTP Client**: Axios for API communication
- **Charts**: Chart.js with React integration for statistics
- **Icons**: Bootstrap Icons library
- **Build Tools**: React Scripts with Create React App
- **Development**: Cross-env for environment variables

## Project Structure

```
board-app/
├── src/
│   ├── components/           # React components
│   │   ├── Auth/            # Login and Registration
│   │   ├── Cards/           # Card-related components
│   │   ├── Layout/          # Dashboard and layout components
│   │   └── ...
│   ├── hooks/               # Custom React hooks (useAuth, useSessionMonitor)
│   ├── services/            # API and authentication services
│   ├── utils/               # Utility functions and configurations
│   ├── config/              # Application configuration files
│   ├── App.js               # Main application component with state management
│   ├── App.css              # Global styles
│   └── index.js             # Application entry point with routing setup
├── public/                  # Static assets
└── package.json             # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 24.10.0 or higher
- npm 11.6.1 or higher
- Backend API running (card-app backend service)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/AguDeveloping/board-app.git
cd board-app
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start the development server:**
```bash
npm run dev
# or
npm start
```

The application will be available at http://localhost:3000

### Available Scripts

- `npm start` - Start development server
- `npm run dev` - Start development server with environment variables
- `npm run build` - Create production build
- `npm run build:production` - Create optimized production build
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App (not recommended)

### Building for Production

```bash
npm run build:production
```

This creates an optimized `build` directory ready for deployment.

## Authentication & Security

### JWT-Based Authentication
- **Default Admin**: username: `admin`, password: `admin`
- **Token Storage**: localStorage for access tokens
- **Session Monitoring**: Automatic token validation and renewal
- **Protected Routes**: Role-based access control

### Token Lifecycle
```
Login → Store Token → API Calls (with Authorization header) → 
Token Validation → Auto-logout on expiration → Redirect to Login
```

### Security Features
- Automatic session expiration handling
- Token timestamp validation (24-hour expiration)
- Secure API communication with bearer tokens
- Protected route guards

## Application Architecture

### State Management
- **React Hooks**: useState, useEffect, useCallback, useMemo for local state
- **Custom Hooks**: useAuth for authentication, useSessionMonitor for session tracking
- **Memoization**: Extensive use of React.memo and useCallback to prevent unnecessary re-renders

### Component Architecture
- **Memoized Components**: Performance-optimized component structure
- **Parent-Child Data Flow**: Centralized state management with prop drilling
- **Separation of Concerns**: Presentational vs. container components
- **API Integration**: Centralized API calls in parent components

### Performance Optimizations
- Memoized dashboard components
- Optimized re-rendering with dependency tracking
- Efficient state updates with useCallback
- Component-level performance monitoring in development

## Development Features

### Environment Configuration
- **Development Mode**: Enhanced logging and debugging
- **Production Mode**: Optimized builds and minimal logging
- **Environment Variables**: Configurable API endpoints and settings

### Debugging & Monitoring
- Comprehensive console logging in development
- React Strict Mode compliance
- Render tracking and performance monitoring
- Effect execution counters for debugging

## Docker Deployment

The application supports containerized deployment:

```bash
# Run as part of complete stack
cd application-docker
docker-compose up -d
```

The app runs on port 3001 in Docker to avoid backend conflicts.

## API Integration

- **Base URL**: Configurable via environment variables
- **Authentication**: JWT bearer token in Authorization header  
- **Error Handling**: Comprehensive error responses with toast notifications
- **Real-time Updates**: Live data synchronization

## Browser Support

### Production
- \>0.2% market share
- Not dead browsers
- Excludes Opera Mini

### Development
- Latest Chrome, Firefox, and Safari versions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC License - see package.json for details

## Author

**AguDeveloping**  
GitHub: https://github.com/AguDeveloping

---

**Version**: 1.1.0  
**Last Updated**: November 2025