# ShelfEx - Job Application Tracking System

A comprehensive job application tracking system built with React, Node.js, and MongoDB.

## Features

- 🔐 Secure authentication with JWT
- 📝 Track job applications with detailed status updates
- 🔔 Real-time notifications using Socket.IO
- 👥 User roles (Admin/Regular users)
- 📱 Responsive Material-UI design
- 🔍 Search and filter applications
- 📊 Admin dashboard for user management

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI
- React Router
- Socket.IO Client
- Axios

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/shelfex.git
cd shelfex
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add the following variables:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     CLIENT_URL=http://localhost:3000
     ```

4. Start the development servers:
```bash
# Start backend server (from server directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## Usage

1. Register a new account or login with existing credentials
2. Add job applications with details like company, role, status, and notes
3. Track application statuses and receive real-time notifications
4. Use the search and filter features to manage multiple applications
5. Access the admin panel (if you have admin privileges) to manage users

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - Aditya Utsav

Project Link: [https://github.com/CodingManiac11/1shelfex.git](https://github.com/CodingManiac11/1shelfex.git)

## Deployment

This project can be deployed live with a Vercel frontend and a Render backend.

### Backend Deployment (Render)

1.  **Prepare Backend:** Ensure you have a `render.yaml` file in the project root (already created). This file configures the Render web service.
2.  **Health Check:** A health check endpoint is available at `/api/health` to monitor backend status.
3.  **Environment Variables:** Set the following environment variables in your Render dashboard:
    *   `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
    *   `JWT_SECRET`: A strong secret key for JWT token signing.
    *   `CLIENT_URL`: The URL of your deployed frontend (e.g., `https://shelfex.vercel.app`).
    *   `NODE_ENV`: Set to `production`.
4.  **CORS Configuration:** Ensure your backend's `server/src/index.ts` has CORS configured to allow requests from your Vercel frontend URL.
5.  **Deploy to Render:**
    *   Go to the [Render Dashboard](https://dashboard.render.com/).
    *   Click "New +" and select "Web Service."
    *   Connect your GitHub repository containing this project.
    *   Render will automatically detect the `render.yaml` file and configure the service based on it.
    *   Confirm the settings (Name, Environment, Build Command, Start Command, Environment Variables) and create the web service.

### Frontend Deployment (Vercel)

1.  **Prepare Frontend:** Ensure you have a `vercel.json` file in the `client` directory (already created). This file configures Vercel to handle API rewrites and build settings.
2.  **Environment Variables:** Set the following environment variables in your Vercel dashboard:
    *   `REACT_APP_API_URL`: The URL of your deployed backend (e.g., `https://shelfex-backend.onrender.com`).
3.  **Deploy to Vercel:**
    *   Go to the [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click "New Project."
    *   Import your GitHub repository.
    *   Vercel will detect your React app and the `vercel.json` file.
    *   Confirm the settings (Framework Preset: Create React App, Root Directory: `client`, Build Command: `npm run build`, Output Directory: `build`, Environment Variables) and deploy.

## Troubleshooting

*   **Frontend "Invalid response from server" on Login/Signup:** This often indicates a mismatch between the frontend's expected API response structure and the backend's actual response. Ensure your `AuthContext.tsx` is correctly destructuring the data returned by the backend.
*   **TypeScript Errors on Backend Build (Render):** Missing type definitions (`@types/*`) can cause build failures. Ensure all necessary `@types` packages are installed as `devDependencies` in `server/package.json` and `tsconfig.json` is configured correctly.
*   **Server not showing logs for requests:** Add a general request logger middleware early in `server/src/index.ts` (e.g., `app.use((req, res, next) => { console.log(...) })`) to verify if requests are reaching your backend.
*   **Persistent TypeScript errors (even after code fixes):** Try a clean rebuild of your project by deleting `node_modules` and `build`/`dist` folders, reinstalling dependencies (`npm install`), and then rebuilding (`npm run build`). This clears cached TypeScript information.
*   **PowerShell '&&' operator error:** When running commands from the root directory targeting subdirectories, execute `cd subdirectory` and `command` separately instead of using `&&`. 
