import React, { useContext, useState, useEffect } from 'react';
import { Auth } from '../Auth'; //get the global username func

export default function App() {
  const { username } = useContext(Auth); // get username
  // filled in with dummy code
  const [userInfo, setUserInfo] = useState({
    userId: '_',
    projectName: '_',
  });

  // dummy hardware set
  const [hardwareSets, setHardwareSets] = useState([
    { id: 1, name: 'HWSet 1', capacity: 9999, available: 9999 },
    { id: 2, name: 'HWSet 2', capacity: 9999, available: 9999 },

  ]);

  // messages
  const [message, setMessage] = useState(null);

  /**
   * handling check-in, will connect to api
   */
  const handleCheckIn = (setId, amount) => {
    if (amount <= 0) {
      setMessage({ type: 'error', text: 'Check-in amount must be greater than zero.' });
      return;
    }
    // will replace with a backend call
    console.log(`checking in ${amount} units for set ${setId}`);
    setMessage({ type: 'success', text: `request to check IN ${amount} units sent` });
  };

  /**
   * handling check-out, will connect to api
   */
  const handleCheckout = (setId, amount) => {
    if (amount <= 0) {
      setMessage({ type: 'error', text: 'checkout amount must be greater than zero' });
      return;
    }
    // later replace w backend call
    console.log(`Checking OUT ${amount} units from set ${setId}`);
    setMessage({ type: 'success', text: `request to check OUT ${amount} units sent` });
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
          {hardwareSets.map(hwSet => (
            <HardwareSet
              key={hwSet.id}
              id={hwSet.id}
              name={hwSet.name}
              capacity={hwSet.capacity}
              available={hwSet.available}
              onCheckIn={handleCheckIn}
              onCheckout={handleCheckout}
            />
          ))}
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
    const numAmount = parseInt(amount, 10);
    if (!isNaN(numAmount) && numAmount > 0) {
      if (action === 'checkin') {
        onCheckIn(id, numAmount);
      } else if (action === 'checkout') {
        onCheckout(id, numAmount);
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
