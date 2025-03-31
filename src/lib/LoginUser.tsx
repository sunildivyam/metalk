import React, { useContext, useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { login } from '../fire/Users';
import { AppContext } from './AppContext';


const LoginUser: React.FC = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const initialUserName = queryParams.get('u') || '';

  const { setMe } = useContext(AppContext);

  const [userName, setUserName] = useState(initialUserName);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async () => {
    setError('');
    try {
      const user = await login(userName, password);
      setMe({ id: user.id, userName: user.userName });
    } catch (error: any) {
      setError(error?.message || error || 'Login Failed.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginUser
