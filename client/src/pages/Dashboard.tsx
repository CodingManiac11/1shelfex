import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { jobs } from '../services/api'; // Import jobs API
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { useNotification } from '../contexts/NotificationContext'; // Import useNotification

interface Job {
  _id: string; // Use _id for MongoDB documents
  company: string;
  role: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  notes?: string;
  appliedDate: string; // Keep as string for date input
  userId: string; // Assuming userId is a string/ObjectId
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  applied: 'primary',
  interviewing: 'info',
  offered: 'success',
  rejected: 'error',
} as const;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Destructure user and logout
  const { showNotification } = useNotification(); // Use notification hook
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [jobList, setJobList] = useState<Job[]>([]); // Renamed to jobList to avoid conflict with imported 'jobs'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobs.getAll();
      setJobList(response.data);
    } catch (err: any) {
      console.error('Failed to fetch jobs:', err);
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []); // Empty dependency array means this runs once on mount

  const filteredJobs = jobList.filter(
    (job) =>
      (job.role.toLowerCase().includes(search.toLowerCase()) || // Search by role
        job.company.toLowerCase().includes(search.toLowerCase()) || // Search by company
        (job.notes && job.notes.toLowerCase().includes(search.toLowerCase()))) && // Search by notes
      (status ? job.status === status : true)
  );

  const handleAddJob = () => {
    navigate('/jobs/new');
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await jobs.delete(jobId);
        showNotification('Job application deleted successfully!', 'success');
        fetchJobs(); // Refresh the list after deletion
      } catch (err: any) {
        console.error('Failed to delete job application:', err);
        showNotification(err.response?.data?.message || 'Failed to delete job application.', 'error');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Job Tracker
          </Typography>
          {user && user.role === 'admin' && (
            <Button color="inherit" component={RouterLink} to="/admin">
              Admin Panel
            </Button>
          )}
          {user && (
            <Button color="inherit" component={RouterLink} to="/profile">
              Profile
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Job Applications
            </Typography>
            <IconButton
              color="primary"
              onClick={handleAddJob}
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <Paper sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Search Jobs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                select
                label="Filter by Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="applied">Applied</MenuItem>
                <MenuItem value="interviewing">Interviewing</MenuItem>
                <MenuItem value="offered">Offered</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </Box>
          </Paper>

          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            },
            gap: 3
          }}>
            {filteredJobs.map((job) => (
              <Card 
                key={job._id} // Use _id from MongoDB
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" gutterBottom>
                      {job.role} at {job.company}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={() => handleEditJob(job._id)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteJob(job._id)} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    📅 Applied: {new Date(job.appliedDate).toLocaleDateString()}
                  </Typography>
                  {job.notes && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Notes: {job.notes}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      color={statusColors[job.status]}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {filteredJobs.length === 0 && !loading && !error && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No jobs found matching your criteria
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 