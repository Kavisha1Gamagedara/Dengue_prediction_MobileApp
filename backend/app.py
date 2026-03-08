import os
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# --- MongoDB Configuration ---
# Read credentials from environment variables for security
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise RuntimeError(
        "MONGODB_URI not set. Please set MONGODB_URI environment variable (or add it to a .env file)."
    )

try:
    client = MongoClient(MONGODB_URI)
    # The database name is typically the last part of the URI, or you can specify it
    # For extraction from URI: mongodb+srv://.../DatabaseName?options
    # In your case: Dengue_prdiction
    db = client.get_database("Dengue_prdiction")
    prediction_logs = db.prediction_logs
    print("Connected to MongoDB successfully")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    raise RuntimeError(f"Could not connect to MongoDB: {e}")

# --- Load your AI Model ---
model = joblib.load('dengue_model.pkl')

@app.route('/predict', methods=['POST'])
def predict_risk():
    try:
        data = request.get_json()
        input_df = pd.DataFrame([data])
        
        # 1. Get AI Prediction
        prediction = model.predict(input_df)
        predicted_cases = round(float(prediction[0]), 2)
        risk_level = 'High' if predicted_cases > 100 else 'Low'

        # 2. Log the request into MongoDB
        log_entry = {
            "temp": data.get('Temp_avg'),
            "precip": data.get('Precipitation_avg'),
            "humidity": data.get('Humidity_avg'),
            "predicted_cases": predicted_cases,
            "risk_level": risk_level,
            "timestamp": pd.Timestamp.now() # Added timestamp for better logging
        }
        
        # Save to MongoDB collection
        prediction_logs.insert_one(log_entry)

        return jsonify({
            'status': 'success',
            'predicted_cases': predicted_cases,
            'risk_level': risk_level
        })
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
