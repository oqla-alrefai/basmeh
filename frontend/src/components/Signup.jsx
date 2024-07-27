import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/Actios/authActions';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD700',
    },
    secondary: {
      main: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#555555',
    },
  },
});

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [full_name, setFull_name] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(state => state.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, full_name, phone }));
  };

  // Redirect to login page or dashboard if signup is successful
  if (success) {
    navigate('/login');
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            margin="normal"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            type="text"
            value={full_name}
            onChange={(e) => setFull_name(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Signup'}
          </Button>
        </form>
        {error && (
          <Alert severity="error" style={{ marginTop: '1rem' }}>
            {error}
          </Alert>
        )}
        <Typography style={{ marginTop: '1rem' }}>
        Already have an account? <Link style={{textDecoration:"none", color:"#FFD700"}} to="/login">Login</Link> 
      </Typography>
      </Container>
    </ThemeProvider>
  );
};

export default Signup;
