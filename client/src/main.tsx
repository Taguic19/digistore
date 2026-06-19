import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import Auth from './pages/auth/Auth'
 import HomePage from './pages/HomePage'
import {Toaster} from 'sonner'

const router = createBrowserRouter([
  {path: '/', element: <Auth />, children:[ {index: true, element: <LoginPage /> }, {path: '/register', element: <RegisterPage />}]},
  {path: '/home', element: <HomePage />}
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position='top-right' />
  </StrictMode>,
)
