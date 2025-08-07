import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Projects from './pages/Projects';
import HardwareCheck from './pages/HardwareCheck';
//this makes sure the routes are closed if not loggedIn
import AuthRoute from './AuthRoute'; 

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">  Login</Link> | 
        <Link to="/projects"> Projects</Link> |
        <Link to="/hardwarecheck"> Hardware Check</Link>
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
