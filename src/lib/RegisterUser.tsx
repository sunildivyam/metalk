import React, { useContext, useState } from 'react';
import { TextField, Button, Typography, Box, Container } from '@mui/material';
import { createUser } from '../fire/Users';
import { AppContext } from './AppContext';

interface RegisterUserProps {
}

const RegisterUser: React.FC<RegisterUserProps> = () => {
  const { setMe } = useContext(AppContext);

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const validateUserName = (name: string) => /^[a-zA-Z0-9]{2,20}$/.test(name);
  const validatePassword = (pass: string) => /^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?\/\\|-]{2,20}$/.test(pass);

  const handleRegister = async () => {
    if (!validateUserName(userName)) {
      setError('Username must be 2 to 20 alphanumeric characters.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be 2 to 20 alphanumeric and symbol characters.');
      return;
    }
    if (password !== rePassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSuggestions([]);
    // Proceed with registration logic
    try {
      const added = await createUser({ userName, password });
      setMe({ id: added.id, userName: added.userName });
    } catch (error: any) {
      setError(error?.message || error);
    }

  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4">Register User</Typography>
        <TextField
          fullWidth
          label="UserName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleRegister();
            }
          }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleRegister();
            }
          }}
        />
        <TextField
          fullWidth
          label="Re-enter Password"
          type="password"
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
          margin="normal"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleRegister();
            }
          }}
        />

        {error && <Typography color="error">{error}</Typography>}
        {suggestions.length > 0 && (
          <Box>
            <Typography style={{ fontSize: '0.7em' }}>Suggested Usernames:</Typography>
            {suggestions.map((suggestion, index) => (
              <Typography style={{ fontSize: '0.7em' }} key={index}>{suggestion}</Typography>
            ))}
          </Box>
        )}
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Register
        </Button>
      </Box></Container>
  );
};

export default RegisterUser;
