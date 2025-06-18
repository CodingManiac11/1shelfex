import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { users } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'applicant';
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [userList, setUserList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await users.getAllUsers();
      setUserList(response.data);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchUsers();
    } else if (user && user.role !== 'admin') {
      setError('You are not authorized to view this page.');
      setLoading(false);
    } else {
      // This case should ideally be handled by PrivateRoute, but good for fallback
      setLoading(false);
    }
  }, [user]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'applicant') => {
    if (!window.confirm(`Are you sure you want to change the role of this user to ${newRole}?`)) {
      return;
    }
    try {
      setSuccess(null);
      setError(null);
      await users.updateUserRole(userId, newRole);
      setSuccess(`User role updated to ${newRole} successfully.`);
      // Refresh user list after successful update
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to update user role:', err);
      setError(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      setSuccess(null);
      setError(null);
      await users.deleteUser(userId);
      setSuccess('User deleted successfully.');
      // Refresh user list after successful deletion
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Panel - User Management
        </Typography>
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  userList.map((userData) => (
                    <TableRow key={userData._id}>
                      <TableCell>{userData.firstName}</TableCell>
                      <TableCell>{userData.lastName}</TableCell>
                      <TableCell>{userData.email}</TableCell>
                      <TableCell>
                        <Box>
                          <TextField
                            value={userData.role}
                            onChange={(e) =>
                              handleRoleChange(userData._id, e.target.value as 'admin' | 'applicant')
                            }
                            disabled={userData._id === user?._id}
                            size="small"
                          >
                            <MenuItem value="applicant">Applicant</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </TextField>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteUser(userData._id)}
                          disabled={userData._id === user?._id}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPanel; 