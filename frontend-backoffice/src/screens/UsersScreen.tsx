import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api.js"
import { useAccessToken } from "../hooks/useAuthenticationContext.js"
import { UserItem } from "../components/UserItem.js";
import { IUser } from "../interfaces/IUser.js"
import { Grid } from "@mui/material";

export function UsersScreen() {
  const accessToken = useAccessToken();

  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data as {
        total: number
        results: IUser[]
      }
    },
  });  

  const users = query.data?.results

  return (
    <Grid container spacing={1} pl={1} mt={10} ml={1} style={{maxWidth: "99vw", maxHeight: "99vh", overflow: "auto"}}>
      <Grid item>
        <Grid container spacing={1}>
          {users?.map((user) => (
            <Grid item key={`users:${user._id}`}>
              <UserItem user={user}/>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  )
}