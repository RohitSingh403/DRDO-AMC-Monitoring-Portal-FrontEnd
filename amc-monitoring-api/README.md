# AMC Monitoring API

Backend API for the AMC Monitoring Portal, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Role-based access control (AMC Personnel and Admin)
- Task management with due date tracking
- Automated task status updates (e.g., marking tasks as overdue)
- RESTful API endpoints
- Secure password hashing
- Request validation and sanitization
- Rate limiting
- CORS enabled
- Comprehensive error handling
- Logging with Winston

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local or MongoDB Atlas)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and update the values:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env` with your configuration

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
FRONTEND_URL=http://localhost:5173
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `GET /api/auth/logout` - Logout user

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/status/:status` - Get tasks by status
- `GET /api/tasks/assigned/me` - Get tasks assigned to current user

## Automated Tasks

The system includes a scheduled task that runs daily at midnight (UTC) to check for and update overdue tasks.

## Testing

```bash
npm test
```

## Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## Formatting

```bash
npm run format
```

## Deployment

### Prerequisites

- MongoDB Atlas account
- Node.js environment (e.g., Heroku, Render, Railway)

### Steps

1. Set up a MongoDB Atlas cluster and get the connection string
2. Deploy the application to your preferred cloud provider
3. Set the required environment variables
4. Start the application

## License

ISC
