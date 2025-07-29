import React, { useState } from 'react';

function Login() {
  const [displayPopup, setdisplayPopup] = useState(false); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newUsername, setnewUsername] = useState('');
  const [newPassword, setNewPassword] = useState(''); 

  const runLogin = (e) => {
    e.preventDefault(); 
    alert(`Logging in as: ${username}`); 
  };

  const CreateAccount = (e) => {
    e.preventDefault(); 
    alert(`Creating account for: ${newUsername}`);
    setdisplayPopup(false); 
  };

  return (
    <div style={{ padding: '20px' }}>
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
    </div>
  );
}

export default Login;
