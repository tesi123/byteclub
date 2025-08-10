from flask import Flask, send_from_directory,request,jsonify
from flask_cors import CORS
from bson import ObjectId
import json
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from src.classes.users import users as Users
from src.classes.projects import project as Projects


app = Flask(__name__, static_folder="./build", static_url_path="/")
CORS(app)

tempUserArr = []

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

db_resources = client["haasappdb"]
db_projects = client["haasappprojectsdb"]
db_users = client["haasappusersdb"]

projects_collection = db_projects["projects"]
users_collection = db_users["users"]
resources_collection = db_resources["resources"]


@app.route("/", methods=["GET"])
def index():
    return send_from_directory(app.static_folder, "index.html")

#router that when you create an account it gets the pswd and account and saves them
@app.route("/createAccount/", methods= ["POST"])
def accountCreate() :
    data = request.json # get json from frontend
    user = data.get('Username')
    pswd = data.get('pswd')
    print ("IS IN BACKEND THE USER created IS " + str(user)+ " PSWD: " + str(pswd))
    
    #check user or pswd is missing or if user exists already
    if not user or not pswd : 
        return jsonify ({'success': False, 'message': 'username or password is missing'})
    if users_collection.find_one({"username": str(user) }):
        return jsonify ({'success': False, 'message': 'username already exists'})
    
    #save user into the database 
    user = Users(username= user, pswd= pswd)
    user.encrypt_user(4)
    #save user and return success
    users_collection.insert_one({'username': user.username, 'password': user.pswd})
    return jsonify ({'success': True, 'message': 'Account created'})


#router that when you login an account it gets the pswd and account and see if it is in data
@app.route("/logIn/", methods= ["POST"])
def accountLogin() :
    data = request.json # get json from frontend

    user = data.get('Username')
    pswd = data.get('pswd')
    print ("IS IN BACKEND THE USER logIn IS " + str(user)+ " PSWD: " + str(pswd))
    decrypt_user = Users(username= user, pswd= pswd)
    decrypt_user.encrypt_user(4)
    #check user or pswd is missing or if user doesn't exist already
    if not user or not pswd : 
        return jsonify ({'success': False, 'message': 'username or password is missing'})
    
    dbUser = users_collection.find_one({"username": str(decrypt_user.username) })
    
    
    if not dbUser :
        return jsonify ({'success': False, 'message': 'username does not exists'})
    else:
        # Compare encrypted password with stored password
        stored_password = dbUser.get('password')  # or whatever field you store password in
        if stored_password == decrypt_user.pswd: 
            return jsonify({'success': True, 'message': 'login successful'}) #return success
        else:
            return jsonify({'success': False, 'message': 'incorrect password'})


def convert_objectid_to_str(obj):
            if isinstance(obj, list):
                return [str(item) if isinstance(item, ObjectId) else item for item in obj  ]
            elif isinstance(obj, ObjectId):
                return str(obj)
            elif isinstance(obj, dict):
                return {k: convert_objectid_to_str(v) for k, v in obj.items()}
            return obj
            
@app.route("/Projects/", methods=["POST"])
def get_project():
    data = request.json
    project_id = data.get("project_id")
    username = data.get("username")
    # check if project_id is provided and is an integer
    try:
        project_id = int(project_id)
    except (ValueError, TypeError):
        return jsonify({"error": "Project ID must be an integer"}), 400
    #encrypt the username for security
    enc_user = Users(username=username, pswd="")
    enc_user.encrypt_user(4) 
    existing_project = projects_collection.find_one({"project_id": project_id})
    if not existing_project:
        return jsonify({"error": "Project not found"}), 404
    #find user in the database
    user = users_collection.find_one({"username": enc_user.username})
    if not user:
            return jsonify({"error": "User not found"}), 404
    #find project in the database
    project_data = projects_collection.find_one({"project_id": project_id})
    if not project_data:
        return jsonify({"error": "Project not found"}), 404
    #if already a member of the project, return the project data
    if user["_id"] in project_data.get("members_list", []):
        return jsonify({"message": "User is already a member of the project", 
                        "project": convert_objectid_to_str(project_data)}), 200
    #if not a member of the project, add user to the project
    try:
        projects_collection.update_one({"project_id": project_id}, {"$addToSet": {"members_list": user["_id"]}})
        project_data = projects_collection.find_one({"project_id": project_id})
        return jsonify({"message": "New member added to the project", 'project': convert_objectid_to_str(project_data)}), 201 # Fetch updated project data           

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/CreateProject/", methods=["POST"])
def create_project():
    data = request.get_json()
    project_id = data.get("project_id")
    project_name = data.get("project_name")
    project_desc = data.get("project_desc")
    username = data.get("username")

    enc_user = Users(username=username, pswd="")
    enc_user.encrypt_user(4)  # Encrypt the username for security
 
    user = users_collection.find_one({"username": enc_user.username})
    if not user:
        return jsonify({"error": "User not found"}), 404
    if not project_id or not project_name or not project_desc:
        return jsonify({"error": "All fields are required"}), 400
    try:
        project_id = int(data.get("project_id", None))
    except (ValueError, TypeError):
        return jsonify({"error": "Project ID must be an integer"}), 400
    #insert into the database
    existing_project = projects_collection.find_one({"project_id": int(project_id)})
    if existing_project:
        return jsonify({"error": "Project ID already exists"}), 400
    
    try:
        project_id = int(project_id)
        new_project = {
            "project_id": project_id,
            "project_name": project_name,
            "project_desc": project_desc, 
            "members_list": [user["_id"]] # Add user ID to members
        }
        insert_result = projects_collection.insert_one(new_project)
        # Retrieve the inserted project document
        inserted_project = projects_collection.find_one({"_id": insert_result.inserted_id})
        inserted_project = convert_objectid_to_str(inserted_project)  # Convert ObjectId to string for JSON
        return jsonify({"message": "Project created successfully", 'project':inserted_project}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 81))
