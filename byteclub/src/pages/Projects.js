import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Projects() {
  const navigate = useNavigate();

  // State for new project input fields
  const [newProject, setNewProject] = useState({
    id: '',
    name: '',
    description: ''
  });

  // State for existing project access
  const [existingProjectId, setExistingProjectId] = useState('');

  // Handle creating a new project
  const handleCreate = () => {
    console.log('Creating project:', newProject);
    // TODO: Add API request to backend if needed
  };

  // Handle accessing an existing project
  const handleAccess = () => {
    console.log('Accessing project:', existingProjectId);
    navigate(`/project/${existingProjectId}`);
  };

  // Navigate to Hardware Check page
  const handleHardwareCheck = () => {
    navigate('/hardwarecheck');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Welcome, [User ID]</h2>

      {/* Create New Project Section */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '30px' }}>
        <h3>Create New Project</h3>
        <input
          placeholder="Project ID"
          value={newProject.id}
          onChange={(e) => setNewProject({ ...newProject, id: e.target.value })}
        /><br /><br />
        <input
          placeholder="Project Name"
          value={newProject.name}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
        /><br /><br />
        <textarea
          placeholder="Description"
          value={newProject.description}
          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
        /><br /><br />
        <button onClick={handleCreate}>Create</button>
      </div>

      {/* Access Existing Project Section */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '30px' }}>
        <h3>Existing Project</h3>
        <input
          placeholder="Project ID"
          value={existingProjectId}
          onChange={(e) => setExistingProjectId(e.target.value)}
        /><br /><br />
        <button onClick={handleAccess}>Access Project</button>
      </div>

      {/* Hardware Navigation Section */}
      <div style={{ border: '1px dashed #aaa', padding: '15px' }}>
        <h3>Hardware</h3>
        <button onClick={handleHardwareCheck}>Go to Hardware Check Page</button>
      </div>
    </div>
  );
}

export default Projects;
