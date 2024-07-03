import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Chat } from "./components/Chat.js";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Chat />,
  },
])

export function PrivateRouter() {
  return <RouterProvider router={router} />
}
