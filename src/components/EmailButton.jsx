import { useSelector } from 'react-redux';
import { Button, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const SendEmailButton = () => {
  
  const { selectedProjects } = useSelector((state) => state.project); // Assuming you're using Redux for selected projects
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendEmail = async () => {
    if (!selectedProjects || selectedProjects.length === 0) {
      setMessage('Please select at least one project.');
      return;
    }

    setIsLoading(true);
    try {
     await axios.post('/api/send-email', { selectedProjects });

      // If the email is sent successfully, show a success message
      setMessage('Email sent successfully!');
    } catch (error) {
      // Handle any errors (e.g., failed to send email)
      setMessage('Failed to send email.',error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleSendEmail}
        variant="contained"
        color="primary"
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Send Email'}
      </Button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SendEmailButton;
