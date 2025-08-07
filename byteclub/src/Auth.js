/* Authenticator method that when the user logs in 
it will pass their information to other pages*/
import React, { createContext, useState } from "react";

export const Auth = createContext(); /* global storage for user's login info */

export const AuthProvider = ({ children }) => {
  const [username, setGlobalUsername] = useState("");
    /* sets the username and user_id as send it to all child components like projects */
  return (
    <Auth.Provider value={{ 
        username,
        setGlobalUsername
         }}>
      {children}
    </Auth.Provider>
  );
};
