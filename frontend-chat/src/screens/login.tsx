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

import { useNavigate } from "react-router-dom";
import { useAuthenticationContext } from '../hooks/useAuthenticationProvider.js';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
  let navigate = useNavigate();

  const routeChange = () =>{ 
    let path = `/chat`; 
    navigate(path);
  }

  const { signIn } = useAuthenticationContext()
  const handleSubmit = ({ document }: any) => {
    signIn( document )
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
            {...form.register('document')}
            margin="normal"
            required
            fullWidth
            label="Document"
            name="document"
            autoComplete="document"
            autoFocus
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
          <Button
            type="button"
            fullWidth
            variant="text"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              let path = `/cadastro`; 
              navigate(path);
            }}
            style={{color: "gray"}}
          >
            Ainda não tem uma conta? Cadastre-se
          </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}