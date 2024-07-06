import { Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthenticationContext } from "../hooks/useAuthenticationContext.js";
import PeopleIcon from '@mui/icons-material/People';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useState } from "react";
import Switch from '@mui/material/Switch';
import { api } from "../services/api.js";

const drawerWidth = 240;

export function Dashboard() {
  const context = useAuthenticationContext();
  const [available, setAvailable] = useState(context.user?.available);

  let navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
    location.reload();
  };

  const handleAvailable = async () => {
    const response = await api.patch('/users/available', { available: !available}, {
      headers: { Authorization: `Bearer ${context.accessToken}` }
    })

    setAvailable(response.data.available);;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        aria-label="mailbox folders"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          open
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <div>
            <List>
              { context.user?.profile == "sudo" && (
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate("/conversations")}>
                    <ListItemIcon>
                      <QuestionAnswerIcon />
                    </ListItemIcon>
                    <ListItemText primary='Conversas' />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/my_conversations")}>
                  <ListItemIcon>
                    <QuestionAnswerIcon />
                  </ListItemIcon>
                  <ListItemText primary='Minhas conversas' />
                </ListItemButton>
              </ListItem>
              {context.user?.profile == "sudo" && (
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate("/users")}>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary='Usuários' />
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(`/profile/${context.user?._id}`)}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary='Meu Perfil' />
                </ListItemButton>
              </ListItem>
              {context.user?.profile == "sudo" && (
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate("/new_user")}>
                    <ListItemIcon>
                      <PersonAdd />
                    </ListItemIcon>
                    <ListItemText primary='Criar Usuário'/>
                  </ListItemButton>
                </ListItem>
              )}
            </List>
            <Divider />
            <ListItem disablePadding>
              <Switch checked={available} onChange={handleAvailable}></Switch>
              <ListItemText primary={available ? "Disponível" : "Indisponível"} />
            </ListItem>
          </div>
          <ListItem disablePadding style={{bottom: "0", position: "absolute", width: "100%", marginBottom: "10"}}>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary='Sair' />
            </ListItemButton>
          </ListItem>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}