from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React frontend to connect

# Load the model
model = load_model("cancer_model.h5")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json["features"]  # expects list of features
        input_array = np.array(data).reshape(1, -1)  # reshape for model
        prediction = model.predict(input_array)[0][0]
        result = "Cancer Detected" if prediction >= 0.5 else "No Cancer"
        return jsonify({"prediction": result, "score": float(prediction)})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
