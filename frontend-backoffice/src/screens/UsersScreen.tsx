import { useQuery } from "@tanstack/react-query"
import { api } from "../services/api.js"
import { useAccessToken } from "../hooks/useAuthenticationContext.js"
import { IUser } from "../interfaces/IUser.js"
import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"

export function UsersScreen() {
  const accessToken = useAccessToken()
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
  })

  const users = query.data?.results

  return (
    <>
      <Box>
        {users?.map(user => (
          <Link to={`/users/${user._id}`}>
            <Box key={`users:${user._id}`}>
              <Typography>
                {user.username}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </>
  )
}