import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Chat } from "./components/Chat.js";
import { HistoryConversationsScreen } from "./screens/HistoryConversationsScreen.js";

const router = createBrowserRouter([
  {
    path: '/',
    element: <HistoryConversationsScreen />,
  },
  {
    path: '/conversations',
    element: <HistoryConversationsScreen />,
    children: [
      {
        path: '/conversations/:conversationId',
        element: <Chat />
      }
    ]
  },
])

export function PrivateRouter() {
  return <RouterProvider router={router} />
}
