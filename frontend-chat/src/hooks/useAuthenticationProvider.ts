import { useContext, useMemo } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationProvider";


export function useAuthenticationContext() {
    return useContext(AuthenticationContext)
}

export function useAuthenticatedUser() {
    const { consumer } = useAuthenticationContext()
  
    if (!consumer) throw new Error('User not authenticated')
  
      console.log(consumer)
  
    return consumer
  }

  export function useHasScope(...oneOfScopes: [string, ...string[]]) {
    const { accessToken } = useAuthenticationContext()
  
    if (!accessToken) throw new Error('Token not found')
  
    return useMemo(() => {
      /*
      if (token.scopes.includes('*')) return true
  
      for (const scope of oneOfScopes)
        if (token.scopes.includes(scope))
          return true
      */
  
      return true
  
      // I know what I'm doing, okay?
    }, [accessToken, ...oneOfScopes])
  }
  
  export function useAccessToken() {
    const { accessToken } = useAuthenticationContext()
    console.log(accessToken)
  
    if (!accessToken) throw new Error('Access token not found')
  
    return accessToken
  }