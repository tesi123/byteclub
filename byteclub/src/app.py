from flask import Flask, send_from_directory, request, json, jsonify
from flask_cors import CORS
import json 
import os 
from classes.projects import project as Project
from classes.resources import resource as Resource
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # Allow requests from React frontend

uri = "mongodb+srv://haas:haaspassword@haas-app-cluster.p0wa0nu.mongodb.net/"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
# MongoDB connection
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)


# MongoDB connection
#client = MongoClient("mongodb+srv://haas:hasspassword2026@haas-app-cluster.p0wa0nu.mongodb.net/")  # adjust if using Atlas
db_resources = client["haasappdb"]
db_projects = client["haasappprojectsdb"]
db_users = client["haasappusersdb"]

projects_collection = db_projects["projects"]
users_collection = db_users["users"]
resources_collection = db_resources["resources"]

@app.route('/projects/<project_id>', methods=['GET'])
def get_projects_by_id(project_id):
    try:
        #print(f"Fetching project with ID: {project_id}")
        project = projects_collection.find_one({"project_id": int(project_id)})
        if not project:
            return jsonify({"error": "Project not found"}), 404
            #print(f"Project found: {project}")
            #if project:
        project['_id'] = str(project['_id'])
        return jsonify(project), 200
    except Exception as e:
        print(f"Error fetching project: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/projects', methods=['POST'])
def create_project():
    data = request.json
    project = Project(
        project_id=data['project_id'],
        project_name=data['project_name'],
        project_desc=data['project_desc'],
        members_list=data['members_list'],
        num_of_hardware_sets=data['num_of_hardware_sets'],
        hardware_set_id=data['hardware_set_id']
    )
    projects_collection.insert_one(project.to_dict())
    return jsonify({'message': 'Project created'}), 201


@app.route('/hello')
def hello():
    return 'Hello from Flask!'

@app.route('/debug-projects', methods=['GET'])
def debug_projects():
    try:
        projects = list(projects_collection.find())
        for project in projects:
            project['_id'] = str(project['_id'])  # convert ObjectId to string
        return jsonify(projects), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 5000))