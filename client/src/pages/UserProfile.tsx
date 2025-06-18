import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../services/api';

interface UserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const UserProfile: React.FC = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      const fetchProfile = async () => {
        try {
          const response = await auth.getProfile();
          setProfileData(response.data);
          setProfileError(null);
        } catch (err: any) {
          console.error('Failed to fetch user profile:', err);
          setProfileError(err.response?.data?.message || 'Failed to load profile');
        } finally {
          setProfileLoading(false);
        }
      };
      fetchProfile();
    } else if (!user && !authLoading) {
      // If not authenticated and auth loading is done, redirect or handle
      setProfileLoading(false);
      setProfileError('User not authenticated.');
    }
  }, [user, authLoading]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => (prev ? { ...prev, [name]: value } : null));
    setProfileSuccess(null);
    setProfileError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordSuccess(null);
    setPasswordError(null);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData) return;

    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(null);

    try {
      const response = await auth.updateProfile({ firstName: profileData.firstName, lastName: profileData.lastName });
      setProfileData(response.data.user); // Assuming backend sends back updated user
      setProfileSuccess('Profile updated successfully!');
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(null);

    try {
      await auth.updatePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordSuccess('Password updated successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err: any) {
      console.error('Failed to update password:', err);
      setPasswordError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <Container component="main" maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom align="center">
          User Profile
        </Typography>

        {profileData && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Personal Information
            </Typography>
            <Box component="form" onSubmit={handleProfileSubmit} sx={{ mt: 2 }}>
              {profileSuccess && <Alert severity="success" sx={{ mb: 2 }}>{profileSuccess}</Alert>}
              {profileError && <Alert severity="error" sx={{ mb: 2 }}>{profileError}</Alert>}
              <TextField
                margin="normal"
                fullWidth
                label="Email Address"
                name="email"
                value={profileData.email}
                InputProps={{ readOnly: true }} // Email is read-only
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="First Name"
                name="firstName"
                value={profileData.firstName}
                onChange={handleProfileChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Last Name"
                name="lastName"
                value={profileData.lastName}
                onChange={handleProfileChange}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={profileLoading}
              >
                {profileLoading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Box>

            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Change Password
            </Typography>
            <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
              {passwordSuccess && <Alert severity="success" sx={{ mb: 2 }}>{passwordSuccess}</Alert>}
              {passwordError && <Alert severity="error" sx={{ mb: 2 }}>{passwordError}</Alert>}
              <TextField
                margin="normal"
                required
                fullWidth
                label="Current Password"
                name="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="New Password"
                name="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm New Password"
                name="confirmNewPassword"
                type={showConfirmNewPassword ? 'text' : 'password'}
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        edge="end"
                      >
                        {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UserProfile; 