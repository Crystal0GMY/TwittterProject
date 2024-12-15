import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Homepage from './Homepage.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import UserProfile from './UserProfile.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: 
    <Homepage />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/userprofile',
    element: <UserProfile />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
