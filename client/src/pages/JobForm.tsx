import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { jobs } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const JobForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'applied', // Default status
    appliedDate: new Date().toISOString().slice(0, 10), // Default to today's date
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (isEditing && id) {
      const fetchJob = async () => {
        setFetchLoading(true);
        try {
          const response = await jobs.getById(id);
          const jobData = response.data;
          setFormData({
            company: jobData.company,
            role: jobData.role,
            status: jobData.status,
            appliedDate: jobData.appliedDate.slice(0, 10),
            notes: jobData.notes || '',
          });
        } catch (err: any) {
          console.error('Failed to fetch job:', err);
          setError(err.response?.data?.message || 'Failed to load job data');
        } finally {
          setFetchLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing && id) {
        await jobs.update(id, formData);
        showNotification('Job application updated successfully!', 'success');
      } else {
        await jobs.create(formData);
        showNotification('Job application added successfully!', 'success');
      }
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to save job application:', err);
      setError(err.response?.data?.message || 'Failed to save job application');
      showNotification(err.response?.data?.message || 'Failed to save job application.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom align="center">
          {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="company"
            label="Company Name"
            name="company"
            value={formData.company}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="role"
            label="Role/Position"
            name="role"
            value={formData.role}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            id="status"
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="interviewing">Interviewing</MenuItem>
            <MenuItem value="offered">Offered</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            id="appliedDate"
            label="Applied Date"
            name="appliedDate"
            type="date"
            value={formData.appliedDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="notes"
            label="Notes"
            name="notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Application' : 'Save Application')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobForm; 