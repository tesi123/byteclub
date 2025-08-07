/* Authenticator method that when the user logs in 
it will pass their information to other pages*/
import React, { createContext, useState } from "react";

export const Auth = createContext(); /* global storage for user's login info */

export const AuthProvider = ({ children }) => {
  const [username, setGlobalUsername] = useState("");
    /* sets the username and user_id as send it to all child components like projects */

     const handleGlobalLogoutClick = () => {
        alert(" Successfully logged out !!");
        setGlobalUsername(null)
    };
  return (
    <Auth.Provider value={{ 
        username,
        setGlobalUsername
         }}>

        {/* Global LogOut button shows only if logged In */}
        { username && (
           <button
            style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            padding: '10px 15px',
            backgroundColor: '#868588ff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            zIndex: 1000
          }}
          onClick={handleGlobalLogoutClick}
        >
          LogOut
        </button>
        )}


      {children}
    </Auth.Provider>
  );
};
