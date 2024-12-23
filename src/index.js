import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, redirect, RouterProvider, useNavigate} from 'react-router-dom';
import App from './App';
import Authentication, { PageType } from './pages/Authentication';
import './index.css';
import { CookiesProvider } from "react-cookie";
import AddChallenge from "./pages/AddChallenge";
import ChallengeDetails from "./pages/ChallengeDetails";
import AdminGuard from './components/AdminGuard'; // Import AdminGuard
import { DOMAIN } from "./Api/config";
import UpdateChallenge from "./pages/UpdateChallenge"; // Import DOMAIN

const AppRoutes = () => {
    const [user, setUser] = useState(null);  // Define state to hold user

    useEffect(() => {
        // Fetch user from sessionStorage when the component mounts
        const storedUser = window.sessionStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));  // Set user data from sessionStorage
        }
    }, []); // Empty dependency array to run once when component mounts

    // If user data is not loaded yet, show a loading message
    if (!user) {
      redirect('/login');
    }

    return (
      <RouterProvider
        router={createBrowserRouter([
            {
                path: '/',
                element: <App />,
            },
            {
                path: '/login',
                element: <Authentication pageType={PageType.LOGIN} />,
            },
            {
                path: '/register',
                element: <Authentication pageType={PageType.REGISTER} />,
            },
            {
                path: '/add-challenge',
                element: (
                  <AdminGuard user={user}>
                      <AddChallenge />
                  </AdminGuard>
                ),
            },{
          path:'/update-challenge/:id',
          element:(
            <AdminGuard user={user}>
              <UpdateChallenge />
            </AdminGuard>
          )
          },{
            path:'/delete-challenge/:id',
            element:(
              <AdminGuard user={user}>
                <h1>Deletes</h1>
              </AdminGuard>
            )
          },
            {
                path: '/challenge/:id',
                element: <ChallengeDetails />,
            },

        ])}
      />
    );
};

// Create the root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
          <AppRoutes />
      </CookiesProvider>
  </React.StrictMode>
);
