import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../Auth'; // get the global username func

function Projects() {
  const { username } = useContext(Auth); // get username
  const navigate = useNavigate();

  // State for new project input fields
  const [newProject, setNewProject] = useState({
    id: '',
    name: '',
    description: ''
  });

  // State for existing project access
  const [existingProjectId, setExistingProjectId] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);

  // Handle creating a new project
  const handleCreate = () => {
    const { id, name, description } = newProject;

    // Check if all fields are filled
    if (!id.trim() || !name.trim() || !description.trim()) {
      const missingFields = [];
      if (!id.trim()) missingFields.push('Project ID');
      if (!name.trim()) missingFields.push('Project Name');
      if (!description.trim()) missingFields.push('Description');
      alert('Please fill in: ' + missingFields.join(', '));
      return;
    }

    // Simulate success message (no backend validation yet)
    alert(`Successfully created:\nProject ID: ${id}\nProject Name: ${name}\nDescription: ${description}`);
  };

  // Handle accessing an existing project
  const handleAccess = async () => {
    const id = existingProjectId.trim();
    if (id === '') {
      alert('Please enter a project ID');
      setProjectDetails(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:81/Projects/`, {
        method: 'POST',
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id })
      });

      if (!response.ok) {
        setProjectDetails(null);
        alert('Project not found or error accessing project');
        return;
      }

      const data = await response.json();
      setProjectDetails(data);
    } catch (error) {
      setProjectDetails(null);
      alert('Project not found or error accessing project');
    }
  };

  // Navigate to Hardware Check page
  const handleHardwareCheck = () => {
    navigate('/hardwarecheck');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Welcome, {username}</h2>

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
        {projectDetails && (
          <div>
            <h4>Project Name: {projectDetails.project_name}</h4>
            <p>Description: {projectDetails.project_desc}</p>
            <p>Hardware Sets: {projectDetails.hardware_set_id.join(', ')}</p>
            <div style={{ border: '1px dashed #aaa', padding: '15px', marginTop: '15px' }}>
              <h3>Hardware</h3>
              <button onClick={handleHardwareCheck}>Go to Hardware Check Page</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
