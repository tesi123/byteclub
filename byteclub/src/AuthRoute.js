import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import {Auth} from "./Auth"; // Authenticate and passes the username globally

/* function that when you are not signed In it always redirects you to login page */

const AuthRoute = ({ children }) => {
  const { username } = useContext(Auth);

  if (!username) {
    return <Navigate to="/" replace />; // Redirect to login if not logged in
  }

  return children; // Otherwise, render the protected component
};

export default AuthRoute