import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./screens/SignIn.js";
import { UsersScreen } from "./screens/UsersScreen.js";

const router = createBrowserRouter([
  { path: '/*', element: <SignIn /> },
  { path: '/users', element: <UsersScreen /> },
])

export function PublicRouter() {
  return <RouterProvider router={router} />
}