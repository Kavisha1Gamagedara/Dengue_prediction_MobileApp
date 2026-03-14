import os
from pathlib import Path
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import joblib
import pandas as pd
from pymongo import MongoClient

app = Flask(__name__)
# Enable CORS for the frontend (assumed to be running on another port)
CORS(app, resources={r"/*": {"origins": "*"}})
bcrypt = Bcrypt(app)

# --- Configuration ---
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

MONGODB_URI = os.getenv("MONGODB_URI")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key-dengue-2024")

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI not set. Please set MONGODB_URI environment variable (or add it to a .env file)."
    )

app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
jwt = JWTManager(app)

# --- MongoDB Connection ---
try:
    client = MongoClient(MONGODB_URI)
    # You can change the database name here if needed
    db = client.get_database("Dengue_prediction_db")
    prediction_logs = db.prediction_logs
    users_collection = db.users
    
    # "Prime" the database with a startup event so it shows in the UI
    db.system_events.insert_one({
        "event": "backend_started",
        "timestamp": datetime.utcnow()
    })
    
    print("Connected to MongoDB and primed database")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise RuntimeError(f"Could not connect to MongoDB: {e}")

# --- Load AI Model ---
try:
    model = joblib.load('dengue_model.pkl')
    print("Model loaded successfully")
except Exception as e:
    print(f"Error loading model: {e}")
    # We continue even if model fails to load, but /predict will fail
    model = None

# --- Helpers ---
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'Backend is reachable!'}), 200

# --- Authentication Routes ---

@app.route('/register', methods=['POST'])
def register():
    print(f"Received registration request: {request.remote_addr}")
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        # Check if user already exists
        if users_collection.find_one({'email': email}):
            return jsonify({'message': 'User with this email already exists'}), 409

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Create user document
        user_doc = {
            'name': name,
            'email': email,
            'password': hashed_password,
            'created_at': datetime.utcnow(),
            'is_new_user': True  # Flag for onboarding
        }
        
        result = users_collection.insert_one(user_doc)

        return jsonify({
            'message': 'User registered successfully',
            'user_id': str(result.inserted_id)
        }), 201
    except Exception as e:
        print(f"Registration error: {e}")
        return jsonify({'message': 'Internal server error during registration'}), 500

@app.route('/login', methods=['POST'])
def login():
    print(f"Received login request: {request.remote_addr}")
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400

        user = users_collection.find_one({'email': email})
        
        if user and bcrypt.check_password_hash(user['password'], password):
            # Create access token
            access_token = create_access_token(identity=str(user['_id']))
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': {
                    'name': user.get('name'),
                    'email': user.get('email'),
                    'id': str(user['_id']),
                    'is_new_user': user.get('is_new_user', False)
                }
            }), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({'message': 'Internal server error during login'}), 500

# --- Profile Routes ---

@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        from bson import ObjectId
        user = users_collection.find_one({'_id': ObjectId(user_id)})
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        return jsonify({
            'name': user.get('name'),
            'email': user.get('email'),
            'is_new_user': user.get('is_new_user', False)
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        from bson import ObjectId
        data = request.get_json()
        
        update_data = {}
        if 'name' in data:
            update_data['name'] = data['name']
        if 'is_new_user' in data:
            update_data['is_new_user'] = data['is_new_user']
            
        if not update_data:
            return jsonify({'message': 'No data provided to update'}), 400
            
        result = users_collection.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': update_data}
        )
        
        return jsonify({'message': 'Profile updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# --- Prediction & Data Routes ---

@app.route('/predict', methods=['POST'])
@jwt_required()
def predict_risk():
    if model is None:
        return jsonify({'status': 'error', 'message': 'Model not loaded'}), 500
        
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Ensure all required features are present
        # Features expected by the model: Temp_avg, Precipitation_avg, Humidity_avg
        required_fields = ['Temp_avg', 'Precipitation_avg', 'Humidity_avg']
        for field in required_fields:
            if field not in data:
                return jsonify({'status': 'error', 'message': f'Missing field: {field}'}), 400

        input_df = pd.DataFrame([data])
        
        # 1. Get AI Prediction
        prediction = model.predict(input_df)
        predicted_cases = round(float(prediction[0]), 2)
        risk_level = 'High' if predicted_cases > 100 else 'Low'

        # 2. Log the request into MongoDB
        log_entry = {
            "user_id": current_user_id,
            "temp": data.get('Temp_avg'),
            "precip": data.get('Precipitation_avg'),
            "humidity": data.get('Humidity_avg'),
            "predicted_cases": predicted_cases,
            "risk_level": risk_level,
            "timestamp": datetime.utcnow()
        }
        
        prediction_logs.insert_one(log_entry)

        return jsonify({
            'status': 'success',
            'predicted_cases': predicted_cases,
            'risk_level': risk_level
        })
    
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    try:
        current_user_id = get_jwt_identity()
        # Fetch last 20 logs for this user
        logs = list(prediction_logs.find({'user_id': current_user_id}).sort('timestamp', -1).limit(20))
        for log in logs:
            log['_id'] = str(log['_id'])
            if isinstance(log['timestamp'], datetime):
                log['timestamp'] = log['timestamp'].isoformat()
        
        return jsonify(logs), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    # Using a different port if needed, but 5000 is default
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)
