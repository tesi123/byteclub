from flask import Flask, send_from_directory,request,jsonify
from flask_cors import CORS
import json
import os


tempUserArr = []
#makes files like JS accessible through URL
app = Flask(__name__, static_folder="./build", static_url_path="/")
CORS(app, resources={r"/*": {"origins":"http://localhost:3000"}}, supports_credentials=True)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

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
    if any(name['Username'] == user for name in tempUserArr):
        return jsonify ({'success': False, 'message': 'username already exists'})
    
    #save user and return success
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
    if not any(name['Username'] == user for name in tempUserArr):
        return jsonify ({'success': False, 'message': 'username does not exists'})
    
    #return success
    return jsonify ({'success': True, 'message': 'Account LogIn'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=os.environ.get("PORT", 81))

