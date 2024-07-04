import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./screens/login";

const router = createBrowserRouter([
  { path: '/*', element: <SignIn /> },
])

export function PublicRouter() {
  return <RouterProvider router={router} />
}