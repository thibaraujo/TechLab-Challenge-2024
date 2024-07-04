import { useAuthenticationContext } from "./hooks/useAuthenticationProvider"
import { PrivateRouter } from "./PrivateRouter"
import { PublicRouter } from "./PublicRouter"


export function Router() {
  const context = useAuthenticationContext()

  if (context.isLoading) return 'Carregando informações do usuário'

  if (!context.consumer) return <PublicRouter />

  return <PrivateRouter />
}
