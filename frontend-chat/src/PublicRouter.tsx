import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./screens/login";
import { RegisterScreen }from "./screens/RegisterScreen";

const router = createBrowserRouter([
  { path: '/', element: <SignIn /> },
  { path: '/cadastro', element: <RegisterScreen /> },
])

export function PublicRouter() {
  return <RouterProvider router={router} />
}