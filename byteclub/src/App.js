import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Projects from './pages/Projects';
import HardwareCheck from './pages/HardwareCheck';
//this makes sure the routes are closed if not loggedIn
import AuthRoute from './AuthRoute'; 
// These two hide the pages until the user logs in
import { useContext } from 'react';
import { Auth } from './Auth';

function App() {
  const { username } = useContext(Auth);
  return (
    <Router>
      <nav>
        <Link to="/">  Login</Link>
        { username && (
        <>
        {' | '}
        <Link to="/Projects"> Projects</Link>
        {' | '}
        <Link to="/Hardwarecheck"> Hardware Check</Link>
        </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={
          <AuthRoute> 
            <Projects />
          </AuthRoute>
          } />
        <Route path ="/hardwarecheck" element={
          <AuthRoute> 
            <HardwareCheck />
          </AuthRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
