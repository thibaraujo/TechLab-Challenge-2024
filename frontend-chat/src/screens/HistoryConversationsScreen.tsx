import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api.js";
import { IConversation } from "../interfaces/IConversation.js";
import { Outlet, useNavigate } from "react-router-dom";
import { ConversationItem } from "../components/ConversationItem.js";
import { LoadingButton } from "@mui/lab";
import { Add, Logout } from "@mui/icons-material";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationProvider.js";


export function HistoryConversationsScreen() {
  const { consumer, accessToken } = useContext(AuthenticationContext);

  const [subject, setSubject] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let navigate = useNavigate();

  

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/conversations/consumers', {
        params: { deleted: true },
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data as {
        total: number
        results: IConversation[]
      }
    },
  });

  const newConversation = async () => {
    const response = await api.post(
      `/conversations`,
      {
        consumer: consumer?._id,
        subject: subject
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    setOpen(false);
    navigate(`/conversations/${response.data._id}`)
    location.reload()
    

  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
    location.reload();
  };


  const conversations = query.data?.results ?? null

  return (
    <Grid container spacing={1} pl={1} mt={1} style={{maxHeight: "99vh", overflow: "auto"}} >
      <Grid item xs={2}>
        <Grid item xs={10} mb={1} ml={1} display="flex" direction="column" alignItems="center" justifyContent="center">
          <LoadingButton
            variant="contained"
            style={{ padding: 16, width: "100%"}}
            startIcon={<Add />}
            onClick={handleClickOpen}
          >
            Nova Conversa
          </LoadingButton>
          <ListItem disablePadding style={{width: "100%"}}>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary='Sair' />
            </ListItemButton>
          </ListItem>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Assunto"}
            </DialogTitle>
            <DialogContent>
              <TextField defaultValue={subject} onChange={(e) => setSubject(e.target.value)}/>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={newConversation} autoFocus>
                Criar
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
        <Divider/>
        <Grid container spacing={1} direction="column" alignItems="center" justifyContent="center">
          <Typography component="h1" variant="h5" style={{marginTop: 20}}>
            Histórico de Conversas
          </Typography>
          {conversations?.map((conversation) => (
            <Grid item key={`conversations:${conversation._id}`}>
              <ConversationItem conversation={conversation} path={"conversations"}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={10}>
        <Outlet />
      </Grid>
    </Grid>
  )
}