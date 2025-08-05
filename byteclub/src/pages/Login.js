import React, { useContext, useState } from 'react';
import Projects from './Projects';
import { useNavigate } from 'react-router-dom';
import {Auth} from "../Auth"; // Authenticate and passes the username globally


function Login() {
  const {username: globalUsername, setGlobalUsername} = useContext(Auth) //set func global
  const navigate = useNavigate(); /* to navigate to project page when logged in */
  const [displayPopup, setdisplayPopup] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setnewUsername] = useState('');
  const [newPassword, setNewPassword] = useState(''); 

  const runLogin = async(e) => {
    e.preventDefault(); 
    alert(`Logging in as: ${username}`); 
    /* link to backend search for username and pswd that matches in dir */

    /* send the data to backend, convery username and pswd to json string */
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      mode: "cors",
      body: JSON.stringify({'Username': username, 'pswd': password })
    };
    const response =  await fetch ("http://127.0.0.1:81/logIn/", requestOptions); /* await until response comes back */
    const data = await response.json(); /* parses response into JSON */
    if (data.success) {
      alert(" Logged In successfully!");
      setGlobalUsername(username) // sets the success username globally
      setdisplayPopup(false);
      navigate("/Projects");
    } else {

      alert("error logging in check username or password");
    }
    
      
  };

  const CreateAccount = async(e) => {
    e.preventDefault(); 
    alert(`Creating account for: ${newUsername}`);
    setdisplayPopup(false); 
    /* added link to backend when you createAccount save username &pswd*/
    const response = await fetch("/createAccount/",{
      method: "POST", 
      headers:  {"Content-Type" : "application/json"},
      mode: "cors",
      body: JSON.stringify({'Username': newUsername, 'pswd': newPassword})
    });
    const data =  await response.json();
    if (data.success) {
      alert("Account created!");
      setdisplayPopup(false);
    } else {
      alert("Username already exists or error in password");
    }
  };

  //function for logging out once you successfully loggedIn
  const LogoutFunc = async(e) => {
    // set global username to empty string
    setGlobalUsername(null)
    alert ("You successfully logged Out")
    navigate('/') //navigate back to logIn page
  }
  
  //show if successfully logged In show only logout else show the rest
  return (
    <div style={{ padding: '20px' }}>
      { globalUsername ? (
        <>
          <h2> Welcome {globalUsername}</h2>
          <button onClick = {LogoutFunc}>Logout</button>
        </>
      ) : (
        <>
          <h2>Login</h2>
      
          <form onSubmit={runLogin}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <br />
          <br />
          <button type="submit">Login</button> 
        </form>

        <br />
        <button type="button" onClick={() => setdisplayPopup(true)}>Create Account</button>

        {displayPopup && (
          <div>
            <h3>Create Account</h3>
            <form onSubmit={CreateAccount}>
              <input 
                type="text" 
                placeholder="New Username" 
                value={newUsername} 
                onChange={(e) => setnewUsername(e.target.value)} 
              />
              <input
                type="password" 
                placeholder="New Password"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
              <br />
              <button type="submit">Submit</button>
              <button type="button" onClick={() => setdisplayPopup(false)}>Cancel</button>
            </form>
          </div>
          )} 
        </>
      )}   
    </div>
  );
}

export default Login;
