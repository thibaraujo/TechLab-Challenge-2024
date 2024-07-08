import { useContext } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationContext.js";

export function useAuthenticationContext() {
  return useContext(AuthenticationContext)
}

export function useAuthenticatedUser() {
  const { user } = useAuthenticationContext()

  if (!user) throw new Error('User not authenticated')

  return user
}

export function useAccessToken() {
  const { accessToken } = useAuthenticationContext()

  if (!accessToken) throw new Error('Access token not found')

  return accessToken
}
