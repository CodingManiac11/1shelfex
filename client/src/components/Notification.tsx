import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Socket } from 'socket.io-client';

interface NotificationProps {
  socket: Socket | null;
}

interface NotificationMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ socket }) => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationMessage>({
    type: 'info',
    message: '',
  });

  useEffect(() => {
    if (socket) {
      socket.on('notification', (data: NotificationMessage) => {
        setNotification(data);
        setOpen(true);
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={notification.type}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification; 