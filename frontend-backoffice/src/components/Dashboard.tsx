import { Box, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useHasScope } from "../hooks/useAuthenticationContext.js";
import PeopleIcon from '@mui/icons-material/People';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useState } from "react";
import Switch from '@mui/material/Switch';

const drawerWidth = 240;

export function Dashboard() {
  const [available, setAvailable] = useState(true); 

  let navigate = useNavigate();

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
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate("/conversations")}>
                  <ListItemIcon>
                    <QuestionAnswerIcon />
                  </ListItemIcon>
                  <ListItemText primary='Conversas' />
                </ListItemButton>
              </ListItem>
              {useHasScope('users:*', 'users:read') && (
                <ListItem disablePadding>
                  <ListItemButton onClick={() => navigate("/users")}>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary='Usuários' />
                  </ListItemButton>
                </ListItem>
              )}
              {useHasScope('users:*', 'users:read') && (
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
              <Switch checked={available} onChange={() => setAvailable(!available)}></Switch>
              <ListItemText primary={available ? "Disponível" : "Indisponível"} />
            </ListItem>
          </div>
          <Link to='/' onClick={() => alert("remover token aqui pra voltar pro login")} style={{bottom: "0", position: "absolute", width: "100%", marginBottom: "10"}}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary='Sair' />
              </ListItemButton>
            </ListItem>
          </Link>
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