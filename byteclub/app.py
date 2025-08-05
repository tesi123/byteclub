from flask import Flask, send_from_directory,request,jsonify
from flask_cors import CORS
import json
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from src.classes.users import users as Users


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
    #save user and return success
    users_collection.insert_one({'username': user.username, 'password': user.pswd})
    tempUserArr.append({'Username': user, 'pswd': pswd})
    return jsonify ({'success': True, 'message': 'Account created'})


#router that when you login an account it gets the pswd and account and see if it is in data
@app.route("/logIn/", methods= ["POST"])
def accountLogin() :
    data = request.json # get json from frontend
    user = data.get('Username')
    pswd = data.get('pswd')
    print ("IS IN BACKEND THE USER logIn IS " + str(user)+ " PSWD: " + str(pswd))
    
    #check user or pswd is missing or if user doesn't exist already
    if not user or not pswd : 
        return jsonify ({'success': False, 'message': 'username or password is missing'})
    dbUser = users_collection.find_one({"username": str(user) })
    if not dbUser:
        return jsonify ({'success': False, 'message': 'username does not exists'})
    
    #return success
    return jsonify ({'success': True, 'message': 'Account LogIn'})


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 81))
