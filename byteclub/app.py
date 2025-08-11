from flask import Flask, send_from_directory,request,jsonify
from flask_cors import CORS
from bson import ObjectId
import json
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from src.classes.users import users as Users
from src.classes.projects import project as Projects
from src.classes.hardware import hardwareSet as hardwareSet


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
        return [convert_objectid_to_str(item) for item in obj]  # recursively process list items
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

@app.route("/Resources/", methods=["POST"])
def get_all_resources():        
    try:
        # Fetch all resources from the database
        resources = list(resources_collection.find())
        # Convert ObjectId to string for JSON serialization
        resources = convert_objectid_to_str(resources)
        return jsonify({"hardware":resources}), 200
    except Exception as e:
        print(f"Error fetching resources: {e}")
        return jsonify({"error": str(e)}), 500  

def add_hardware_set_to_project(project_id, set_id):
    project = projects_collection.find_one({"project_id": project_id})
    if not project:
        return False, "Project not found"
    result = projects_collection.update_one({"project_id": project_id}, {"$addToSet": {"hardware_set_id": set_id}})

    if result.modified_count == 0: #hardware set already existts
        return False, "Hardware set already exists in project"
    else:
        return True, "Hardware set added to project"    
    
def check_out_hardware_for_project(project_id, set_id, qty):
    # 1. Validate project and linkage
    project = projects_collection.find_one({"project_id": project_id})
    if not project:
        return False, "Project not found"

    if set_id not in project.get("hardware_set_ids", []):
        return False, "Hardware set not linked to project"

    # 2. Fetch hardware set info (assuming you store them in a collection)
    hardware_set_doc = resources_collection.find_one({"setid": set_id})
    if not hardware_set_doc:
        return False, "Hardware set not found"

    # 3. Create hardwareSet object and load current capacity and availability
    hw = hardwareSet()
    hw.initialize_capacity(hardware_set_doc["capacity"])
    hw._hardwareSet__availability = hardware_set_doc.get("availability", hw.get_capacity())
    hw._hardwareSet__checkedOut = hardware_set_doc.get("checkedOut", [])

    # 4. Perform checkout (use project_id index in checkedOut list)
    result = hw.check_out(qty, project_id)

    if result == 0:
        # Update the hardware set document in DB with new availability and checkedOut list
        resources_collection.update_one(
            {"setid": set_id},
            {"$set": {
                "availability": hw.get_availability(),
                "checkedOut": hw._hardwareSet__checkedOut
            }}
        )
        return True, "Checked out successfully"
    else:
        return False, "Not enough units available for checkout"
    
@app.route("/HardwareCheckIn/", methods=["POST"])
def hardware_check_in():
    data = request.json
    set_id = data.get("setid")
    amount = data.get("amount")
    project_id = data.get("projectId")

    if  set_id is None or amount is None or project_id is None:
        return jsonify({"error": "setid, amount, and projectId are required"}), 400

    try:
        amount = int(amount)
        project_id = int(project_id)
    except ValueError:
        return jsonify({"error": "Invalid setid, amount, or projectId"}), 400
    #fetch the hardware set from the database
    hardware_set_doc = resources_collection.find_one({"setid": set_id})
    if not hardware_set_doc:
        return jsonify({"error": "Hardware set not found"}), 404
    # Check in the hardware
    hw = hardwareSet()
    hw.initialize_capacity(hardware_set_doc["capacity"])
    hw._hardwareSet__availability = hardware_set_doc.get("availability", hw.get_capacity())
    hw._hardwareSet__checkedOut = hardware_set_doc.get("checkedOut", [])
    

    #check in the hardware
    result= hw.check_in(amount, project_id)
    
    if result == -1:
        return jsonify({"error": "Cannot check in more than checked out"}), 400 
    if result == 0:
        # Update the hardware set document in DB with new availability and checkedOut list
        resources_collection.update_one(
            {"setid": set_id},
            {"$set": {
                "availability": hw.get_availability(),
                "checkedOut": hw._hardwareSet__checkedOut
            }}
        )
       

        projects_collection.update_one({"project_id": project_id}, 
        {"$inc": {f"checked_out.{set_id}":- amount}})
        return jsonify({"message": f"Checked in {amount} units of {set_id}."}), 200
    else:
        return jsonify({"error": "Error checking in hardware."}), 500   

@app.route("/HardwareCheckOut/", methods=["POST"])    
def hardware_check_out():
    data = request.json
    set_id = data.get("setid")
    amount = data.get("amount")
    project_id = data.get("projectId")

    if not set_id or not amount or not project_id:
        return jsonify({"error": "setid, amount, and projectId are required"}), 400

    try:
        amount = int(amount)
        project_id = int(project_id)
    except ValueError:
        return jsonify({"error": "Invalid setid, amount, or projectId"}), 400

    # Fetch the hardware set from the database
    hardware_set_doc = resources_collection.find_one({"setid": set_id})
    if not hardware_set_doc:
        return jsonify({"error": "Hardware set not found"}), 404

    # Check out the hardware
    hw = hardwareSet()
    hw.initialize_capacity(hardware_set_doc["capacity"])
    hw._hardwareSet__availability = hardware_set_doc.get("availability", hw.get_capacity())
    hw._hardwareSet__checkedOut = hardware_set_doc.get("checkedOut", [])

    result = hw.check_out(amount, project_id)
    #partial checkout
    if result == 0:
        # Update the hardware set document in DB with new availability and checkedOut list
        resources_collection.update_one(
            {"setid": set_id},
            {"$set": {
                "availability": hw.get_availability(),
                "checkedOut": hw._hardwareSet__checkedOut
            }}
        )
        projects_collection.update_one({"project_id": project_id}, 
                                        {"$addToSet": {"hardware_set_id": set_id}})

        projects_collection.update_one({"project_id": project_id}, 
        {"$inc": {f"checked_out.{set_id}": amount}})
                                        
        return jsonify({"message": f"Checked out {amount} units of {set_id}."}), 200
    elif result == 1:
        resources_collection.update_one(
            {"setid": set_id},
            {"$set": {
                "availability": hw.get_availability(),
                "checkedOut": hw._hardwareSet__checkedOut
            }}
        )
        projects_collection.update_one({"project_id": project_id}, 
                                        {"$addToSet": {"hardware_set_id": set_id}})
        projects_collection.update_one({"project_id": project_id}, 
        {"$inc": {f"checked_out.{set_id}": amount}})
        return jsonify({"message": f"Checked out {amount} units of {set_id} (partial checkout)."}), 200
    else:
        return jsonify({"error": "Error checking out hardware."}), 500
if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 81))
