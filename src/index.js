import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './pages/App';
import theme from './config/theme'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ChakraProvider } from '@chakra-ui/react';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import App from './pages/App';
const router = createBrowserRouter([
    {
        "path": "/",
        "element": <Home />,
    },
    {
        "path": "/login",
        "element": <Login />
    },
    {
        "path": "/signup",
        "element": <SignUp />
    },
    {
        "path": "/dashboard",
        "element": <Dashboard />
    },
    {
        "path": "/code/:code_id",
        "element": <App />
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ChakraProvider >
            <RouterProvider router={router} />
        </ChakraProvider>
    </React.StrictMode>
);
