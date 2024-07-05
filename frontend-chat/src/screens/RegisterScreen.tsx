import { Typography, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { api } from "../services/api";
import { IConsumer } from "../interfaces/IConsumer";
import { LoadingButton } from "@mui/lab";
import Button from '@mui/material/Button';
import { Grid, Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import SaveIcon from '@mui/icons-material/Save'
import { useNavigate } from "react-router-dom";

export function RegisterScreen() {
  const [statusAlert, setStatusAlert] = useState(-1);
  const [alert, setAlert] = useState(true); 
  
  let navigate = useNavigate();

  const save = useMutation({
    mutationFn: async (consumer: Partial<IConsumer>) => {
      const response = await api.post(`/consumers`, consumer);

      let navigate = useNavigate(); 

      setStatusAlert(response.status);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
        if(statusAlert == 200) {
            let path = `/`; 
            navigate(path);
        }
      }, 3000);
    }
  });

  const form = useForm<Partial<IConsumer>>({});

  return (
    <Grid container spacing={1} pl={10} mt={10} xs={10} direction="row" justifyItems="flex-start" alignItems="flex-start">
        
        <Grid item sm={10}>
            <Typography component="h1" variant="h5">
            Cadastro
            </Typography>
        </Grid>
      <Grid item sm={10}>
        <TextField label="Nome" {...form.register('firstName')} fullWidth />
      </Grid>
      <Grid item sm={10}>
        <TextField label="Sobrenome" {...form.register('lastName')} fullWidth />
      </Grid>
      <Grid item sm={10}>
        <TextField label="Documento" {...form.register('document')} fullWidth />
      </Grid>
      <Grid item sm={10}>
      <Grid item sm={5}>
        <LoadingButton
            variant="contained"
            style={{ padding: 16 }}
            startIcon={<SaveIcon />}
            onClick={form.handleSubmit((data) => save.mutate(data))}
            >
            Cadastrar
        </LoadingButton>
    </Grid>
      <Grid item sm={5}>
        <Button
            type="reset"
            variant="text"
            onClick={() => {
                let path = `/`; 
                navigate(path);
            }}
        >
            Voltar
        </Button>
        
        </Grid>
        
        
      </Grid>
      <Grid item sm={10}>
        {statusAlert == 200 ? 
          alert && 
          <Alert severity="success">
            <AlertTitle>Sucesso</AlertTitle>
            Usuário criado com sucesso.
          </Alert>
          : statusAlert != -1 ? 
          alert && 
          <Alert severity="error">
            <AlertTitle>Erro</AlertTitle>
            Não foi possível criar o usuário.
          </Alert> : <></>
        }
      </Grid>
    </Grid>
  );
}
