import { ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { IConversation } from "../interfaces/IConversation.js";
import { useNavigate } from "react-router-dom";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CircleIcon from '@mui/icons-material/Circle';
import { useMemo } from "react";

export interface ConversationItemProps {
  conversation: IConversation,
  path: string
}

export function ConversationItem({ conversation, path }: ConversationItemProps) {
  const consumerIdentifier = useMemo(() => {
    if (conversation.consumer.firstName) return conversation.consumer.firstName

    return `Doc: ${conversation.consumer.document}`
  }, [conversation])

  let navigate = useNavigate();

  return (
    <Paper style={{width: "12vw"}}>
      <Typography variant="body1" gutterBottom>
        <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/${path}/${conversation._id}`)}>
              <ListItemIcon>
                <ChatBubbleIcon />
              </ListItemIcon>
              <ListItemText primary={conversation.subject} secondary={consumerIdentifier} primaryTypographyProps={{ noWrap: true }}/>
            </ListItemButton>
          </ListItem>
      </Typography>
      <ListItem>
        <CircleIcon style={{color: conversation.deletedAt? "red": "green", fontSize: 9, marginRight: 10}}/>
        <ListItemText secondary={conversation.deletedAt? `Finalizada em ${conversation.deletedAt}`: "Em andamento"}/>
      </ListItem>
    </Paper>
  )
}