import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Projects from './pages/Projects';
import HardwareCheck from './pages/HardwareCheck';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">  Login</Link> | 
        <Link to="/Projects"> Projects</Link> |
        <Link to="/Hardwarecheck"> Hardware Check</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path ="/hardwarecheck" element={<HardwareCheck />} />
      </Routes>
    </Router>
  );
}

export default App;
