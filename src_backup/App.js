import React, { useState } from "react";
import "./index.css";

function App() {
  const [features, setFeatures] = useState(Array(30).fill(""));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (idx, value) => {
    const newFeatures = [...features];
    newFeatures[idx] = value;
    setFeatures(newFeatures);
  };

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const featureArray = features.map(Number);
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featureArray }),
      });
      if (!response.ok) throw new Error((await response.json()).detail || "Prediction failed");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Prediction failed");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Breast Cancer Prediction</h1>
      <p>Enter 30 features below (comma-separated or one per box):</p>
      <div className="features-grid">
        {features.map((val, idx) => (
          <input
            key={idx}
            type="number"
            value={val}
            onChange={e => handleChange(idx, e.target.value)}
            placeholder={`F${idx + 1}`}
            className="feature-input"
          />
        ))}
      </div>
      <button className="predict-btn" onClick={handlePredict} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="result">
          <h3>Prediction: {result.prediction === 1 ? "Malignant" : "Benign"}</h3>
          <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
        </div>
      )}
      <footer>Made with ❤️ for Cancer Detection</footer>
    </div>
  );
}

export default App;