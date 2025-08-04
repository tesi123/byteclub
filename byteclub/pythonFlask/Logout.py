from flask import Flask, send_from_directory,request,json
from flask_cors import CORS
import json
import os

#makes files like JS accessible through URL
app = Flask(__name__, static_folder="./build", static_url_path="/")
CORS(app) # helps share resources so frontend can make API calls to backend
