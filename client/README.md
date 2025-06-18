# Job Application Tracker - Frontend

This is the frontend application for the Job Application Tracker, built with React, TypeScript, and Material UI.

## Features

- User authentication (login/register)
- Job application management (CRUD operations)
- Real-time notifications using Socket.io
- Responsive design
- Material UI components
- TypeScript for type safety

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/pages/` - Page components
- `src/services/` - API and service functions
- `src/App.tsx` - Main application component
- `src/index.tsx` - Application entry point

## Available Scripts

- `npm start` - Start the development server
- `npm build` - Build the production bundle
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Dependencies

- React
- TypeScript
- Material UI
- React Router
- Axios
- Socket.io Client
- Emotion (for styling)
