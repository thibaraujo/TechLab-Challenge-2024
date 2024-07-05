import { TextField, Select, MenuItem, Typography} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { LoadingButton } from "@mui/lab";
import { Grid, Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import SaveIcon from '@mui/icons-material/Save'
import { IUser } from "../interfaces/IUser";
import { useAccessToken } from "../hooks/useAuthenticationContext.js";

export function NewUserScreen() {
  const [statusAlert, setStatusAlert] = useState(-1);
  const [alert, setAlert] = useState(true); 

  const accessToken = useAccessToken()

  const save = useMutation({
    mutationFn: async (user: Partial<IUser>) => {
      const response = await api.post(`/users`, user, 
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setStatusAlert(response.status);
      setAlert(true);

      if(response.status == 201){
        form.resetField("username")
        form.resetField("email")
        form.resetField("password")
        form.resetField("profile")
      }

      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  });

  const form = useForm<Partial<IUser>>({});

  return (
    <Grid container spacing={1} pl={10} mt={10} xs={10} direction="row" justifyItems="flex-start" alignItems="flex-start">
      <Grid item sm={10}>
            <Typography component="h1" variant="h5">
            Novo Usuário
            </Typography>
        </Grid>
      
      <Grid item sm={10}>
        <TextField label="Username" {...form.register('username')} fullWidth />
      </Grid>
      <Grid item sm={10}>
        <TextField label="E-mail" {...form.register('email')} fullWidth />
      </Grid>
      <Grid item sm={10}>
        <TextField label="Password" {...form.register('password')} type="password" fullWidth />
      </Grid>
      <Grid item sm={10}>
        <Select label="Profile" {...form.register('profile')} defaultValue="" fullWidth>
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
          Criar
        </LoadingButton>
      </Grid>
      <Grid item sm={10}>
        {statusAlert == 201 ? 
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
