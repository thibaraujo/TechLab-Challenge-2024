import { Typography, MenuItem, Select, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useAccessToken } from "../hooks/useAuthenticationContext";
import { IUser, IUserPayload } from "../interfaces/IUser";
import { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { Grid, Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import SaveIcon from '@mui/icons-material/Save'

export function UserScreen() {
  const params = useParams();
  const userId = params.userId;

  const [statusAlert, setStatusAlert] = useState(-1);
  const [alert, setAlert] = useState(true); 
  
  let navigate = useNavigate();

  if (!userId) throw new Error('No userId provided');

  const accessToken = useAccessToken();

  const save = useMutation({
    mutationFn: async (user: Partial<IUser>) => {
      const userPayload = { username: user.username, email: user.email, profile: user.profile } as IUserPayload
      const response = await api.put(`/users`, userPayload, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          id: user._id
        }
      });

      setStatusAlert(response.status);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 3000);

      if(response.status == 200) navigate("/users")
    }
  });

  const user = useQuery({
    queryKey: ['users', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return response.data as IUser;
    }
  });

  const form = useForm<Partial<IUser>>({});

  useEffect(() => {
    if (!user.data) return;

    Object.entries(user.data).forEach(([key, value]) => {
      // @ts-ignore
      form.setValue(key, value);
    });
  }, [user.data]);

  if (!user.data) return 'Carregando...';

  return (
    <Grid container spacing={1} ml={"20vh"} mt={10} xs={10} maxWidth={"100%"} direction="row" justifyItems="flex-start" alignItems="flex-start">
      <Grid item sm={10}>
        <Typography component="h1" variant="h5">
        Editar Usuário
        </Typography>
      </Grid>
      <Grid item sm={10}>
        <TextField label="Username" {...form.register('username')} fullWidth />
      </Grid>
      <Grid item sm={10}>
        <TextField label="E-mail" {...form.register('email')} fullWidth />
      </Grid>
      <Grid item sm={10}>
        {/* <TextField label="Password" {...form.register('password')} type="password" fullWidth /> */}
      </Grid>
      <Grid item sm={10}>
        <Select label="Profile" {...form.register('profile')} defaultValue={user.data.profile} fullWidth>
          <MenuItem value='standard'>Standard</MenuItem>
          <MenuItem value='sudo'>Sudo</MenuItem>
        </Select>
      </Grid> 
      <Grid item sm={10}>
        <LoadingButton
          variant="contained"
          style={{ padding: 16 }}
          startIcon={<SaveIcon />}
          onClick={form.handleSubmit((data) => save.mutate(data))}
        >
          Salvar
        </LoadingButton>
      </Grid>
      <Grid item sm={10}>
        {statusAlert == 200 ? 
          alert && 
          <Alert severity="success">
            <AlertTitle>Sucesso</AlertTitle>
            Alterações salvas com sucesso.
          </Alert>
          : statusAlert != -1 ? 
          alert && 
          <Alert severity="error">
            <AlertTitle>Erro</AlertTitle>
            Não foi possível salvar as alterações.
          </Alert> : <></>
        }
      </Grid>
    </Grid>
  );
}
