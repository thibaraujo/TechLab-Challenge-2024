import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ConversationsScreen } from "./screens/ConversationsScreen.js";
import { Dashboard } from "./components/Dashboard.js";
import { UsersScreen } from "./screens/UsersScreen.js";
import { ConversationScreen } from "./screens/ConversationScreen.js";
import { UserScreen } from "./screens/UserScreen.js";
import { NewUserScreen } from "./screens/NewUserScreen.js";
import { MyConversationsScreen } from "./screens/MyConversationsScreen.js";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
    children: [
      { path: '/', element: <MyConversationsScreen /> },
      {
        path: '/conversations',
        element: <ConversationsScreen />,
        children: [
          {
            path: '/conversations/:conversationId',
            element: <ConversationScreen />
          }
        ]
      },
      {
        path: '/my_conversations',
        element: <MyConversationsScreen />,
        children: [
          {
            path: '/my_conversations/:conversationId',
            element: <ConversationScreen />
          }
        ]
      },
      { path: '/users', element: <UsersScreen /> },
      { path: '/users/:userId', element: <UserScreen /> },
      { path: '/profile/:userId', element: <UserScreen /> },
      { path: '/new_user', element: <NewUserScreen /> },
      
    ]
  },
])

export function PrivateRouter() {
  return <RouterProvider router={router} />
}
