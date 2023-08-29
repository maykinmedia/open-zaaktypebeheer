import { useState } from 'react';
import { Login } from '@mui/icons-material/';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAuth } from '../components/Auth/Auth';
import { useNavigate } from 'react-router-dom';
import logo from '/logo.svg';
import PasswordField from '../components/Fields/Password';
import { APIError, BadRequest } from '../errors/errors';

export default function LoginView() {
  const [error, setError] = useState<APIError>(undefined!);
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await auth.onSignIn(data);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err as BadRequest);
    }
  }

  return (
    <Box
      component={'main'}
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={3}
        component={'form'}
        onSubmit={handleLogin}
        sx={{
          margin: 'auto',
          padding: '2rem',
          gap: '1rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '90%',
          maxWidth: '30rem',
        }}
      >
        <img src={logo} alt="logo" height={50} />
        <Typography variant="h4" component={'h1'}>
          Login
        </Typography>
        {error && <p>{error.message}</p>}
        <TextField
          variant="filled"
          label="Gebruikersnaam"
          name="username"
          id="username"
          type={'text'}
          autoComplete="username"
          required
        />
        <PasswordField />
        <Button
          size="large"
          color={'primary'}
          startIcon={<Login />}
          variant="contained"
          type="submit"
          aria-label="Login"
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
}
