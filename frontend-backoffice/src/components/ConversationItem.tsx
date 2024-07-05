import { Button, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { IConversation } from "../interfaces/IConversation.js";
import { Link, useNavigate } from "react-router-dom";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { useMemo } from "react";

export interface ConversationItemProps {
  conversation: IConversation
}

export function ConversationItem({ conversation }: ConversationItemProps) {
  const consumerIdentifier = useMemo(() => {
    if (conversation.consumer.name) return conversation.consumer.name

    return `Doc: ${conversation.consumer.document}`
  }, [conversation])

  let navigate = useNavigate();

  return (
    <Paper>
      <Typography variant="body1" gutterBottom>
        <ListItem disablePadding>
            <ListItemButton onClick={() => navigate(`/conversations/${conversation._id}`)}>
              <ListItemIcon>
                <ChatBubbleIcon />
              </ListItemIcon>
              <ListItemText primary={conversation.subject} secondary={consumerIdentifier}/>
            </ListItemButton>
          </ListItem>
      </Typography>
    </Paper>
  )
}