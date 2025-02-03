from flask import Flask, request, jsonify, session, redirect
from flask_cors import CORS
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from datetime import date

from utilities.user import User

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'meowmeowmeow'

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"message": "Unauthorized"}), 401

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.get(email)

    if user and user.verify_password(email, password):
        login_user(user, remember = True)
        return jsonify({"message": "Login Successful"})
    else:
        return jsonify({"message": "Login Failed"}), 401
    
if __name__ == "__main__":
    app.run(debug = True, port = 5010)
