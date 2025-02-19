import { createContext, PropsWithChildren, useMemo, useState } from "react"
import { IConsumer } from "../interfaces/IConsumer"
import { useMutation, useQuery } from "@tanstack/react-query"
import { decodeJsonWebToken } from "../tools/decodeJsonWebToken"
import { api } from "../services/api"

export interface IAuthenticationContext {
  accessToken: string | null
  consumer: IConsumer | null
  isLoading: boolean
  signIn(document: string): void
}

export const AuthenticationContext = createContext(null as unknown as IAuthenticationContext)

export function AuthenticationProvider({ children }: PropsWithChildren) {
  //const [accessToken, setAccessToken] = useState(() => null)
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('session:access-token') ?? null)
 
  const { consumerId } = useMemo(() => {
    if (!accessToken) return { token: null, consumerId: null }
    const token = decodeJsonWebToken(accessToken)

    if (!token) return { token: null, consumerId: null }

    if (typeof token === 'string') return { token: null, consumerId: null }

    const consumerId = token.consumer;

    return { token, consumerId }
  }, [accessToken])

  const query = useQuery({
    queryKey: ['consumers', consumerId],
    queryFn: async () => {
      const response = await api.get(`/consumers/${consumerId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data
    },
    enabled: !!consumerId
  })

  const { mutateAsync: signIn } = useMutation({
    mutationFn: (document: string) => {
      const response = api.post('/consumers/sign-in', { document });
      return response;
    },
    onSuccess: response => {
      const  access_token  = response.data.token;

      setAccessToken(access_token)

      localStorage.setItem('session:access-token', access_token)
    }, 
    onError: () => {
      setAccessToken(null)
      localStorage.removeItem('session:access-token')
    }
  })

  const consumer = (query.data ?? null) as IConsumer | null

  const isLoading = useMemo(() => query.isLoading, [query.isLoading])

  return (
    <AuthenticationContext.Provider value={{ accessToken, consumer, isLoading, signIn }}>
      {children}
    </AuthenticationContext.Provider>
  )
}
