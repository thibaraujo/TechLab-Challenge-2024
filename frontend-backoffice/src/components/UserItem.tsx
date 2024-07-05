import { ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { IUser } from "../interfaces/IUser.js";
import { Link } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export interface IUserItemProps {
  user: IUser
}

export function UserItem({ user }: IUserItemProps) {
  return (
    <Paper>
      <Typography variant="body1" gutterBottom>
        <Link to={`/users/${user._id}`}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={user.username} secondary={user.email}/>
            </ListItemButton>
          </ListItem>
        </Link>
      </Typography>
    </Paper>
  )
}