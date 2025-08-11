import React, { useContext, useState, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../Auth'; //get the global username func
import {useLocation} from 'react-router-dom'
export default function App() {
const { username } = useContext(Auth); // get username
  
const location = useLocation();
 // hardware sets state
const [hardwareSets, setHardwareSets] = useState([]);
  // messages
const [message, setMessage] = useState(null);
// user info state
const [userInfo, setProjectInfo] = useState({
  userId: location.state?.userId || '',
  projectName: location.state?.projectName || 'Default Project',
  projectId: location.state?.projectId || null,
});
useEffect(() => {
    if (location.state) {
      setProjectInfo({
      projectName: location.state.projectName || 'Default Project',
      projectId: location.state.projectId || null,
      userId: location.state.userId || username,
      });
    }
  }, [location.state]);
 
  useEffect(() => {
    // Fetch hardware sets from the backend
  fetchHardwareSets();},[])
    // Simulate fetching user info
  /**
   * handling check-in, will connect to api
   */

  async function fetchHardwareSets() 
  {
      try {
      const response = await fetch(`/Resources/`, {
        method: 'POST',
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
       // body: JSON.stringify({ project_id: id , username:username}) // Include the global username
      });

    
      const data = await response.json();
      setHardwareSets(data.hardware); // Update state with the fetched hardware sets
     
    } catch (error) {
      setHardwareSets(null);
      setMessage({ type: 'error', text: 'Error fetching hardware sets.' });
    }
  }
  const handleCheckIn =  async (setId, amount) => {
    if (amount <= 0) {
      setMessage({ type: 'error', text: 'Check-in amount must be greater than zero.' });
      return;
    }
    if(!userInfo.projectId) {
      setMessage({ type: 'error', text: 'Please select a project first.' });
      return;
    }
    try{
      const response = await fetch("/HardwareCheckIn/", {
        method: 'POST',
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setid: setId, amount, projectId: userInfo.projectId }) // Include the global username
      });
      const result = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: `Checked in ${amount} units of ${setId}.` });
        fetchHardwareSets(); // Refresh hardware sets after check-in
      } else if (result.success && !(response.ok)) { // checkIn the max it can checkIn
        setMessage({ type: 'error', text: result.error || 'Error checking in hardware.' });
        fetchHardwareSets(); // Refresh hardware sets after check-in
      } else{
        setMessage({ type: 'error', text: result.error || 'Error checking in hardware.' });
      }

    }
    catch (error) {
      console.error("Error checking in hardware:", error);
      setMessage({ type: 'error', text: 'Error checking in hardware.' });
    }

    // will replace with a backend call
  //  console.log(`checking in ${amount} units for set ${setId}`);
   // setMessage({ type: 'success', text: `request to check IN ${amount} units sent` });
  };

 
    // Simulate fetching hardware sets from an API
  /**
   * handling check-out, will connect to api
   */
  const handleCheckout = async (setId, amount) => {
    if (amount <= 0) {
      setMessage({ type: 'error', text: 'checkout amount must be greater than zero' });
      return;
    }
    if(!userInfo.projectId) {
      setMessage({ type: 'error', text: 'Please select a project first.' });
      return;
    }
    try{
      const response = await fetch("/HardwareCheckOut/",
        {
          method: 'POST',
          mode: 'cors',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ setid: setId, amount, projectId: userInfo.projectId }) // Include the global username
        });
      const result = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: `Checked out ${amount} units of ${setId}.`});
        fetchHardwareSets(); // Refresh hardware sets after checkout
      } else if (result.success && !(response.ok)){ //checkOut the max it can checkOut
        setMessage({ type: 'error', text: result.error || 'Error checking in hardware.'});
        fetchHardwareSets(); 
      } else {
        setMessage({ type: 'error', text: result.error || 'Error checking out hardware.' });
      }
    }
    catch (error) {
      console.error("Error checking out hardware:", error);
      setMessage({ type: 'error', text: 'Error checking out hardware.' });
    }
    // later replace w backend call
    //console.log(`Checking OUT ${amount} units from set ${setId}`);
    //setMessage({ type: 'success', text: `request to check OUT ${amount} units sent` });
  };

  return (
    <div>
      {/* Header Section */}
      <header>
        <h1>Haas System</h1>
        <div>
          <span>Welcome, <span>{username}</span></span>
          <span> | </span>
          <span>Current Project: <span>{userInfo.projectName}</span></span>
        </div>
      </header>
      
      {message && (
        <div style={{ padding: '10px', margin: '10px 0', border: '1px solid gray' }}>
          <p>{message.text}</p>
          <button onClick={() => setMessage(null)}>&times;</button>
        </div>
      )}

      <main>
        <h2>Hardware Resource Status</h2>
        <div>
        {hardwareSets && hardwareSets.length > 0 ? (
          hardwareSets.map(hwSet => (
            <HardwareSet
              key={hwSet.setid}
              id={hwSet.setid}
              name={hwSet.name}
              capacity={hwSet.capacity}
              available={hwSet.availability}
              onCheckIn={handleCheckIn}
              onCheckout={handleCheckout}
            />
          ))
        ) : (
          <p>No hardware resources available.</p>
        )}
        </div>
      </main>
    </div>
  );
}

// hardware set component
function HardwareSet({ id, name, capacity, available, onCheckIn, onCheckout }) {
  const [amount, setAmount] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  const handleActionClick = (action) => {
    const qty = parseInt(amount, 10);
    if (!isNaN(qty) && qty > 0) {
      if (action === 'checkin') {
        onCheckIn(id, qty);
      } else if (action === 'checkout') {
        onCheckout(id, qty);
      }
      setAmount('');
    }
  };

  return (
    <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
      <h3>{name}</h3>
      <div>
        {/* capacity/availability */}
        <div>
          <p>Capacity: <span>{capacity} units</span></p>
          <p>Available: <span>{available} units</span></p>
        </div>

        {/* actions */}
        <div style={{ marginTop: '10px' }}>
          <label htmlFor={`amount-${id}`}>Amount:</label>
          <input
            id={`amount-${id}`}
            type="text"
            value={amount}
            onChange={handleInputChange}
            placeholder="0"
            style={{ marginLeft: '5px', marginRight: '10px' }}
          />
          <button onClick={() => handleActionClick('checkin')} style={{ marginRight: '5px' }}>
            Check In
          </button>
          <button onClick={() => handleActionClick('checkout')}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
