# Job Application Tracker - Backend

This is the backend server for the Job Application Tracker application, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication with JWT
- Job application management (CRUD operations)
- Real-time notifications using Socket.io
- MongoDB database with Mongoose ODM
- TypeScript for type safety
- RESTful API design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/job_tracker

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Client URL for CORS
   CLIENT_URL=http://localhost:3000
   ```

3. Start MongoDB:
   - Make sure MongoDB is installed and running on your system
   - The default connection URL is `mongodb://localhost:27017`
   - The database will be created automatically when the application starts

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Jobs

- `GET /api/jobs` - Get all jobs for the authenticated user
- `GET /api/jobs/:id` - Get a specific job
- `POST /api/jobs` - Create a new job application
- `PUT /api/jobs/:id` - Update a job application
- `DELETE /api/jobs/:id` - Delete a job application

## Project Structure

```
src/
├── config/         # Configuration files
├── middleware/     # Express middleware
├── models/         # Database models
├── routes/         # API routes
├── socket.ts       # Socket.io setup
└── index.ts        # Main application file
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Dependencies

- express - Web framework
- mongoose - ODM for MongoDB
- socket.io - Real-time communication
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- cors - CORS middleware
- dotenv - Environment variables
- typescript - TypeScript support 