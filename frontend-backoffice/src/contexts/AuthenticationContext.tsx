import { createContext, PropsWithChildren, useMemo, useState } from "react";
import { IUser } from "../interfaces/IUser.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../services/api.js";
import { decodeJsonWebToken } from "../tools/decodeJsonWebToken.js";

export interface IToken {
  scopes: string[]
  sub: string
}

export interface IAuthenticationSignInPayload {
  username: string
  password: string
}

export interface IAuthenticationContext {
  accessToken: string | null
  token: IToken
  user: IUser | null
  isLoading: boolean
  signIn(payload: IAuthenticationSignInPayload): void
}

export const AuthenticationContext = createContext(null as unknown as IAuthenticationContext)

export function AuthenticationProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('session:access-token') ?? null)

  const { mutateAsync: signIn } =  useMutation({
    mutationFn: async ({ username, password }: IAuthenticationSignInPayload) => {
      const response = await api.post('/auth/sign-in', {}, {
        auth: {
          username: username,
          password: password
        }
      })

      return response
    },
    onSuccess: (response) => {
      setAccessToken(response.data.token)
      localStorage.setItem('session:access-token', response.data.token)
    },
    onError: () => {
      setAccessToken(null)
      localStorage.removeItem('session:access-token')
    }
  })

  const token = useMemo(() => {
    if (!accessToken) return null

    const payload = decodeJsonWebToken(accessToken)

    if (!payload) return null

    if (typeof payload === 'string') return null

    return payload
  }, [accessToken])

  const userId = useMemo(() => {
    if (!token?.user) return null

    const userId = token.user

    return userId
  }, [token])

  const userQuery = useQuery<IUser>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await api.get(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data
    },
    enabled: !!userId,
  })

  const user = useMemo(() => userQuery.data ?? null, [userQuery.data])

  const isLoading = useMemo(() => userQuery.isLoading, [userQuery.isLoading])

  const value = useMemo(() => ({ token, accessToken, user, isLoading, signIn: signIn }), [token, accessToken, user, isLoading, signIn])

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  )
}
