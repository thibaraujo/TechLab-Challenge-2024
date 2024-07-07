import { 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  Grid,
  Alert,
  AlertTitle
} from "@mui/material";
import { IUser } from "../interfaces/IUser.js";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Delete from '@mui/icons-material/Delete';
import ModeEdit from '@mui/icons-material/ModeEdit';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAccessToken } from "../hooks/useAuthenticationContext.js";
import { api } from "../services/api";

export interface IUserItemProps {
  user: IUser
}

export function UserItem({ user }: IUserItemProps) {
  let navigate = useNavigate(); 
  const [open, setOpen] = useState(false);
  const [statusAlert, setStatusAlert] = useState(-1);
  const [alert, setAlert] = useState(true);  
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const accessToken = useAccessToken();

  const deleteUser = async () => {
    await api.delete(`/users`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        id: user._id
      }
    }).then((response) => {
      setStatusAlert(response.status);
      setAlert(true);
    }).catch((error) => {
      setStatusAlert(error.response.status);
      setAlert(true);
      setErrorMessage(error.response.data.message);
    });

    setTimeout(() => {
      setAlert(false);
      location.reload();
    }, 1800);

    if(statusAlert == 200) {
      navigate("/users", {replace: true});
    }

    setOpen(false);
  };

  return (
    <Paper style={{width:"80vw"}}>
      <Typography variant="body1" gutterBottom>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={user.username} secondary={user.email}/>
            <ListItemIcon></ListItemIcon>
            <ListItemIcon onClick={() => navigate(`/users/${user._id}`)}>
              <ModeEdit />
            </ListItemIcon>
            <ListItemIcon onClick={handleClickOpen}>
              <Delete />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Excluir usuário"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Tem certeza que deseja excluir o usuário? 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={deleteUser} autoFocus>
              Excluir
            </Button>
          </DialogActions>
        </Dialog>
        <Grid item sm={10}>
          {statusAlert == 200 ? 
            alert && 
            <Alert severity="success">
              <AlertTitle>Sucesso</AlertTitle>
              Usuário excluído com sucesso.
            </Alert>
            : statusAlert != -1 ? 
            alert && 
            <Alert severity="error">
              <AlertTitle>Erro</AlertTitle>
              Erro ao excluir usuário. Erro: {errorMessage}
            </Alert> : <></>
          }
        </Grid>
      </Typography>
    </Paper>
  )
}