import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../Auth'; //get the global username func


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
    console.log('Creating project:', newProject);
    // TODO: Add API request to backend if needed
  };

  // Handle accessing an existing project
  const handleAccess = async() => {
    console.log('Accessing project:', existingProjectId);
    const id = parseInt(existingProjectId);
    if (isNaN(id)) {
      alert('Please enter a valid project ID');
      setProjectDetails(null); // Clear project details if invalid ID
      return;
    }
    try{
      const response = await fetch(`http://localhost:81/Projects/`, {
        method: 'POST',
       mode: 'cors',headers: {"Content-Type" : "application/json"},
        body: JSON.stringify({ project_id: id })
      }); 
      if (!response.ok) {
        const text = await response.text(); // fallback to plain text/HTML
        setProjectDetails(null); // Clear project details on error
        console.error('Error response:', text);
        throw new Error('Failed to fetch projects');
}
      const data = await response.json();
      
      setProjectDetails(data);
      console.log('Project details:', data);
    } catch (error) {
      setProjectDetails(null); // Clear project details on error
      console.error('Error accessing project:', error);
      alert('Project not found or error accessing project');
    }
   // navigate(`/project/${existingProjectId}`);
  };

  // Navigate to Hardware Check page
  const handleHardwareCheck = () => {
    navigate('/hardwarecheck');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Welcome, {username} </h2>

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
    </div>
  )}
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
