import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import JobForm from "./pages/JobForm";
import UserProfile from "./pages/UserProfile";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotificationProvider, useNotification } from "./contexts/NotificationContext";
import PrivateRoute from "./components/PrivateRoute";
import NotificationToasts from "./components/NotificationToasts";
import { initializeSocket, disconnectSocket, socket } from "./services/api";

function AppContent() {
  const { user, token } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (token && user) {
      initializeSocket(token);

      if (socket) {
        socket.on('jobCreated', (job) => {
          showNotification(`New job added: ${job.role} at ${job.company}`, 'success');
        });
        socket.on('jobUpdated', (job) => {
          showNotification(`Job updated: ${job.role} at ${job.company}`, 'info');
        });
        socket.on('jobDeleted', (jobId) => {
          showNotification(`Job deleted successfully.`, 'warning');
        });

        socket.on('adminNotification', (data) => {
          if (user.role === 'admin') {
            showNotification(`Admin Alert: ${data.message}`, 'info');
          }
        });
      }
    } else {
      disconnectSocket();
    }

    return () => {
      if (socket) {
        socket.off('jobCreated');
        socket.off('jobUpdated');
        socket.off('jobDeleted');
        socket.off('adminNotification');
      }
    };
  }, [token, user, showNotification]);

  return (
    <>
      <NotificationToasts />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs/new"
          element={
            <PrivateRoute>
              <JobForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/jobs/edit/:id"
          element={
            <PrivateRoute>
              <JobForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;