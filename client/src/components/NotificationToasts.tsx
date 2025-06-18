import React from 'react';
import {
  Snackbar,
  Alert,
} from '@mui/material';
import { useNotification } from '../contexts/NotificationContext';

const NotificationToasts: React.FC = () => {
  const { notifications, hideNotification } = useNotification();

  const handleClose = (id: string) => {
    hideNotification(id);
  };

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={6000} // Notifications disappear after 6 seconds
          onClose={() => handleClose(notification.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ mt: 7 }} // Adjust position to not overlap with AppBar
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationToasts; 