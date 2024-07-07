import { Alert, AlertTitle, Grid } from "@mui/material";
import { useAccessToken } from "../hooks/useAuthenticationContext.js";
import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api.js";
import { ConversationItem } from "../components/ConversationItem.js";
import { IConversation } from "../interfaces/IConversation.js";
import { Outlet } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import LocalShipping from '@mui/icons-material/LocalShipping'
import { useState } from "react";

export function ConversationsScreen() {
  // const user = useAuthenticatedUser()
  const accessToken = useAccessToken();

  const [statusAlert, setStatusAlert] = useState(-1);
  const [alert, setAlert] = useState(true); 

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


  const distributeConversations = async () => {
    const response = await api.post('/conversations/distribute', {}, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    setStatusAlert(response.status);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
      location.reload();
    }, 1800);

  };

  // const count = useMemo(() => {
  //   return query.data?.count ?? NaN
  // }, [query.data?.count])

  const conversations = query.data?.results ?? null

  return (
    <>
    <Grid container>
      <Grid item mt={1} ml={1}>
        <LoadingButton
          variant="contained"
          style={{ padding: 16 }}
          startIcon={<LocalShipping />}
          onClick={distributeConversations}
        >
          Distribuir conversas
        </LoadingButton>
      </Grid>
    <Grid item>
      {statusAlert == 200 ? 
        alert && 
        <Alert severity="success">
          <AlertTitle>Sucesso</AlertTitle>
          Conversas distribuídas com sucesso.
        </Alert>
        : statusAlert != -1 ? 
        alert && 
        <Alert severity="error">
          <AlertTitle>Erro</AlertTitle>
          Não foi possível distribuir as conversas.
        </Alert> : <></>
      }
    </Grid>

    </Grid>
    <Grid container spacing={1} pl={1} mt={1} style={{maxHeight: "99vh", overflow: "auto"}}>
      <Grid item xs={2}>
        <Grid container spacing={1}>
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
    </>
  )
}