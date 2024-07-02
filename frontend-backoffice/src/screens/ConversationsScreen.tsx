import { Grid } from "@mui/material";
import { useAccessToken } from "../hooks/useAuthenticationContext.js";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api.js";
import { ConversationItem } from "../components/ConversationItem.js";
import { IConversation } from "../interfaces/IConversation.js";
import { Outlet } from "react-router-dom";
import { useMemo } from "react";

export function ConversationsScreen() {
  // const user = useAuthenticatedUser()
  const accessToken = useAccessToken()

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await api.get('/conversations', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      console.log(response)

      return response.data as {
        total: number
        results: IConversation[]
      }
    },
  })

  // const count = useMemo(() => {
  //   return query.data?.count ?? NaN
  // }, [query.data?.count])

  const conversations = query.data?.results ?? null

  return (
    <Grid container spacing={2} pl={0.1}>
      <Grid item xs={2}>
        <Grid container spacing={1}>
          {conversations?.map((conversation) => (
            <Grid item key={`conversations:${conversation._id}`}>
              <ConversationItem conversation={conversation}/>
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
