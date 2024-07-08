import { useContext } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationProvider";


export function useAuthenticationContext() {
    return useContext(AuthenticationContext)
}

export function useAuthenticatedUser() {
    const { consumer } = useAuthenticationContext()
  
    if (!consumer) throw new Error('User not authenticated')

  
    return consumer
  }
  
  export function useAccessToken() {
    const { accessToken } = useAuthenticationContext()
  
    if (!accessToken) throw new Error('Access token not found')
  
    return accessToken
  }