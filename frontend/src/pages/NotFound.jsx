import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '20vh' }}>
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <ErrorOutlineIcon color="error" sx={{ fontSize: 80 }} />
        <Typography variant="h1" component="h1" gutterBottom>
          404 Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          The page you are looking for does not exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={handleHomeClick}
          sx={{ marginTop: 4, background:"#FFD700" }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
