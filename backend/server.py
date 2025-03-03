import json
import os
import re

import google.generativeai as genai
import pymongo
from dotenv import load_dotenv
from flask import (Flask, jsonify, redirect, request, send_from_directory, make_response,
                   session)
from flask_cors import CORS
from flask_login import (LoginManager, current_user, login_required,
                         login_user, logout_user)
from Utilities.chatbot import Chatbot
from Utilities.recommend import Recommend
from Utilities.User import User
from functools import wraps
from flask_session import Session
import jwt
import datetime

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["WatchWise"]
# Initialize AI Extractor
chatbot = Chatbot()

# Flask App
app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "meowmeowmeow")
# app.config["SESSION_TYPE"] = "filesystem"  # Store session on disk, not cookies
# app.config["SESSION_COOKIE_SAMESITE"] = "None"
# Session(app)
#

# Flask-Login Setup
frontend_path = os.path.join(os.getcwd(), "frontend", "dist")

@app.before_request
def handle_preflight():
    """Automatically respond to OPTIONS requests for CORS"""
    if request.method == "OPTIONS":
        return '', 200  # Empty response with 200 status for preflight requests

@app.route("/", defaults={"filename": ""})
@app.route("/<path:filename>")
def index(filename):
    if not filename:
        filename = "index.html"
    return send_from_directory(frontend_path, filename)



def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # jwt is passed in the request header
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            print(token)
        # return 401 if token is not passed
        if not token:
            return jsonify({'message' : 'Token is missing !!'}), 401
  
        try:
            # decoding the payload to fetch the stored details
            print(token)
            data = jwt.decode(token,app.config['SECRET_KEY'],verify=True,algorithms=["HS256"])
            print(data)
            current_user = User.get(data['user_id'])
        except:
            return jsonify({
                'message' : 'Token is invalid !!'
            }), 401
        # returns the current logged in users context to the routes
        return  f(current_user, *args, **kwargs)
  
    return decorated

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.get_user(email)

    if user and user.verify_password(password):
        token = jwt.encode({
            'user_id': user.id,
            'exp' : datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes = 60)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        print(token)
  
        return make_response(jsonify({'token' : token}), 201)
    else:
        return jsonify({"message": "Login Failed"}), 401


@app.route("/api/check", methods=["GET", "POST"])
@token_required
def check_login(user):
    if request.method == "OPTIONS" or request.method == "POST":  # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type, Authorization"
        )
        return response, 200
    return jsonify({'user':user.id}), 200


@app.route("/api/register", methods=["OPTIONS", "POST"])
def register():
    if request.method == "OPTIONS":  # Handle CORS preflight request
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type, Authorization"
        )
        return response, 200
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    if User.register_user(email, password, name):
        return jsonify({"message": "Registered successfully"}), 200
    else:
        return jsonify({"message": "Registration unsuccessful"}), 401


chat_history = {}


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_id = data.get("user_id", "default_user")
    user_input = data.get("user_input", "")

    return chatbot.process_input(user_id, user_input)


@app.route("/api/movies", methods=["GET"])
def movies():
    recommended_shows = Recommend.hybrid_recommend(
        user_id=2473170, mood_input="fear", top_n=20
    )
    print(recommended_shows)
    movie_collection = db["moviesDB"]
    all_movies = []
    movie_data = []
    for category, movies in recommended_shows.items():
        if isinstance(movies, list):
            all_movies.extend(set(movies))

    print(all_movies)
    for movie in all_movies:
        poster_path = movie_collection.find_one({"title": movie})["poster_path"]
        if poster_path == "Not Found":
            poster_path = "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg"
        movie_data.append({"title": movie, "poster": poster_path})

    if not all_movies:
        return jsonify({"error": "No recommendations found"}), 204

    return jsonify({"movies": movie_data}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5010)
