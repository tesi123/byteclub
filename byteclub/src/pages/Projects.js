import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../Auth'; // get the global username func

function Projects() {
  const { username } = useContext(Auth); // get username
  const navigate = useNavigate();

  // State for new project input fields
  const [newProject, setNewProject] = useState({
    project_id: '',
    project_name: '',
    project_desc: ''
  });

  // State for existing project access
  const [existingProjectId, setExistingProjectId] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);
  
  // Handle creating a new project
  const handleCreate = async () => {
    const{ project_id, project_name, project_desc } = newProject;

    // Check if all fields are filled
    if (!project_id.trim() || !project_name.trim() || !project_desc.trim()) {
      const missingFields = [];
      if (!project_id.trim()) missingFields.push('Project ID');
      if (!project_name.trim()) missingFields.push('Project Name');
      if (!project_desc.trim()) missingFields.push('Description');
      alert('Please fill in: ' + missingFields.join(', '));
      return;
    }
    
    try{
      const response = await fetch("/CreateProject/", {
        method: 'POST',
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id,
          project_name,
          project_desc,
          username // Include the username for backend processing
        })
      });

     

      const data = await response.json();
       if (!response.ok) {
        if(data.error === "Project ID already exists") {
          alert('Project ID already exists. Please choose a different ID.');
          return;
        }else {alert('Error creating project. Please try again.'+ data.error);}
        const errorText = await response.text();
        console.error("Error creating project:", errorText);
        alert('Error creating project. Please try again.');
        throw new Error('Network response was not ok');
      }
      alert(`Project created successfully:`);
      setProjectDetails(data.project); // Update state with the new project details
      setNewProject({ project_id: '', project_name: '', project_desc: '' }); // Reset input fields
    }
    catch (error) {
      console.error("Error creating project:", error);
      alert('Error creating project. Please try again.');
      return;
    }

    // Simulate success message (no backend validation yet)
   // alert(`Successfully created:\nProject ID: ${id}\nProject Name: ${name}\nDescription: ${description}`);
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
      const response = await fetch(`/Projects/`, {
        method: 'POST',
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: id , username:username}) // Include the global username
      });

      if (!response.ok) {
        setProjectDetails(null);
        alert('Project not found or error accessing project');
        return;
      }

      const data = await response.json();
      if (response.status === 201 && data.message) {
  
      alert(data.message);  // new member added to the project popup alert
    }
      setProjectDetails(data.project);
    } catch (error) {
      setProjectDetails(null);
      alert('Project not found or error accessing project');
    }
  };

  // Navigate to Hardware Check page
  const handleHardwareCheck = () => {
  navigate('/hardwarecheck', {
    state: {
      userId: username,
      projectName: projectDetails.project_name,
      projectId: projectDetails.project_id  
    }
  });
};

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Welcome, {username}</h2>

      {/* Create New Project Section */}
      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '30px' }}>
        <h3>Create New Project</h3>
        <input
          placeholder="Project ID"
          value={newProject.project_id}
          onChange={(e) => setNewProject({ ...newProject, project_id: e.target.value })}
        /><br /><br />
        <input
          placeholder="Project Name"
          value={newProject.project_name}
          onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
        /><br /><br />
        <textarea
          placeholder="Description"
          value={newProject.project_desc}
          onChange={(e) => setNewProject({ ...newProject, project_desc: e.target.value })}
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
            <p>Hardware Sets: {projectDetails.hardware_set_id && projectDetails.hardware_set_id.length>0 ? projectDetails.hardware_set_id.join(', '): 'No hardware sets available'}</p>
          

            <p>Hardware Sets: {projectDetails.hardware_set_id && projectDetails.hardware_set_id.length > 0
  ? projectDetails.hardware_set_id.join(', ')
  : 'No hardware sets available'}</p>
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
