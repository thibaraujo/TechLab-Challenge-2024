import { Grid, Typography } from "@mui/material";
import { useAccessToken } from "../hooks/useAuthenticationContext.js";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api.js";
import { ConversationItem } from "../components/ConversationItem.js";
import { IConversation } from "../interfaces/IConversation.js";
import { Outlet } from "react-router-dom";

export function MyConversationsScreen() {
  const accessToken = useAccessToken()

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/conversations/user', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      console.log(response)

      return response.data as {
        total: number
        results: IConversation[]
      }
    },
  })

  const conversations = query.data?.results ?? null

  return (
    <Grid container spacing={1} pl={1} mt={1} style={{maxHeight: "99vh", overflow: "auto"}}>
      <Grid item xs={2}>
        <Typography variant="h6" component="h6">
          Minhas Conversas
        </Typography>
        <Grid container spacing={1}>
          {conversations?.map((conversation) => (
            <Grid item key={`my_conversations:${conversation._id}`}>
              <ConversationItem conversation={conversation} path={"my_conversations"}/>
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