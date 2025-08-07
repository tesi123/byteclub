import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Projects() {
  //const navigate = useNavigate();
 // const[projects, setProjects] = useState([]);

  // State for existing project access
  const[existingProjectId, setExistingProjectId] = useState('');
   // Handle creating a new project
  const [newProject, setNewProject] = useState({
    project_name: '',
    project_desc: '',
    num_of_hardware_sets: '',
    members_list: [],
    hardware_set_id: [],
  });

  const [projectDetails, setProjectDetails] = useState(null);
  const navigate = useNavigate();

  const handleCreate = () => {
    console.log('Creating project:', newProject);
    axios.post('http://localhost:5000/projects', newProject)
      .then(response => {
        console.log('Project created:', response.data);
        alert('Project created successfully!');
        setNewProject({
          project_name: '',
          project_desc: '',
          num_of_hardware_sets: '',
          members_list: [],
          hardware_set_id: [],
        });
      })
      .catch(error => {
        console.error('Error creating project:', error);
        alert('Failed to create project. Please try again.');
      });
  };

  const handleAccess = async(e) => {
    const id = parseInt(existingProjectId);
    if (isNaN(id) || id <= 0) {
      alert('Please enter a valid project ID.');
      return;
    } 
    try {
      const response = await axios.get(`http://localhost:5000/projects/${existingProjectId}`);
      if (response.data) {
        setProjectDetails(response.data);
        console.log('Project details:', response.data);
      } else {
        alert('Project not found.');
      }
    } catch (error) {
      console.error('Error accessing project:', error);
      alert('Failed to access project. Please try again.');
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
  <h3>Access Existing Project</h3>
  <input
    placeholder="Project ID"
    value={existingProjectId}
    onChange={(e) => setExistingProjectId(e.target.value)}
  />
  <br /><br />
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
