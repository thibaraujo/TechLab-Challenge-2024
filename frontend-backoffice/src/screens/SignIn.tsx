/* eslint-disable @typescript-eslint/no-explicit-any */
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useForm } from 'react-hook-form'
import { useAuthenticationContext } from '../hooks/useAuthenticationContext.js';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { Alert, AlertTitle, Grid } from '@mui/material';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/thibaraujo/TechLab-Challenge-2024">
        Thiago Batista Araújo - TechLab Challenge
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {

  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusAlert, setStatusAlert] = useState(-1);

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    let path = `/users`; 
    navigate(path);
  }

  const { signIn } = useAuthenticationContext()
  const handleSubmit = async ({ username, password }: any) => {
    try {
      await signIn({ username, password });
    } catch (error: any) {
      setAlert(true);
      setStatusAlert(error.response.status);
      setErrorMessage(error.response.data.message);
    }
  };

  const form = useForm()

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Entrar
        </Typography>
        <Box component="form" onSubmit={form.handleSubmit(handleSubmit)} noValidate sx={{ mt: 1 }}>
          <TextField
            {...form.register('username')}
            margin="normal"
            required
            fullWidth
            label="E-mail"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            {...form.register('password')}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {routeChange}}
          >
            Entrar
          </Button>
          <Grid item sm={10}>
            {statusAlert == 200 ? 
              alert && 
              <Alert severity="success">
                <AlertTitle>Sucesso</AlertTitle>
                Sucesso.
              </Alert>
              : statusAlert != -1 ? 
              alert && 
              <Alert severity="error">
                <AlertTitle>Erro</AlertTitle>
                Erro: {errorMessage}
              </Alert> : <></>
            }
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}