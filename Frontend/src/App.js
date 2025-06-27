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

  // Generate random test data
  const generateRandomData = () => {
    const randomFeatures = Array(30).fill(0).map(() => 
      (Math.random() * 10).toFixed(2)
    );
    setFeatures(randomFeatures);
    setResult(null);
    setError("");
  };

  // Load sample data (benign case)
  const loadSampleData = () => {
    const sampleFeatures = [
      17.99, 10.38, 122.8, 1001, 0.1184, 0.2776, 0.3001, 0.1471, 0.2419, 0.07871,
      1.095, 0.9053, 8.589, 153.4, 0.006399, 0.04904, 0.05373, 0.01587, 0.03003, 0.006193,
      25.38, 17.33, 184.6, 2019, 0.1622, 0.6656, 0.7119, 0.2654, 0.4601, 0.1189
    ];
    setFeatures(sampleFeatures.map(f => f.toString()));
    setResult(null);
    setError("");
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

  const isFormValid = features.every(f => f !== "" && !isNaN(f));

  return (
    <div className="app">
      <div className="header">
        <div className="logo">
          <span className="logo-icon">🔬</span>
          <h1>AI Cancer Detection</h1>
        </div>
        <p className="subtitle">Advanced Machine Learning for Breast Cancer Prediction</p>
      </div>

      <div className="main-container">
        <div className="input-section">
          <h2>Enter Patient Data</h2>
          <p>Please provide 30 clinical features for analysis</p>
          
          {/* Quick Action Buttons */}
          <div className="quick-actions">
            <button 
              className="action-btn random-btn"
              onClick={generateRandomData}
            >
              🎲 Generate Random Data
            </button>
            <button 
              className="action-btn sample-btn"
              onClick={loadSampleData}
            >
              📋 Load Sample Data
            </button>
            <button 
              className="action-btn clear-btn"
              onClick={() => setFeatures(Array(30).fill(""))}
            >
              🗑️ Clear All
            </button>
          </div>
          
          <div className="features-grid">
            {features.map((val, idx) => (
              <div key={idx} className="input-group">
                <label>Feature {idx + 1}</label>
                <input
                  type="number"
                  step="0.01"
                  value={val}
                  onChange={e => handleChange(idx, e.target.value)}
                  placeholder={`F${idx + 1}`}
                  className="feature-input"
                />
              </div>
            ))}
          </div>

          <button 
            className={`predict-btn ${!isFormValid ? 'disabled' : ''}`}
            onClick={handlePredict} 
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <span className="loading">
                <span className="spinner"></span>
                Analyzing...
              </span>
            ) : (
              '🔍 Analyze Results'
            )}
          </button>
        </div>

        {error && (
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="result-card">
            <div className="result-header">
              <h2>Analysis Results</h2>
              <div className={`status-badge ${result.prediction === 1 ? 'malignant' : 'benign'}`}>
                {result.prediction === 1 ? '🔴 Malignant' : '🟢 Benign'}
              </div>
            </div>
            
            <div className="result-details">
              <div className="confidence-meter">
                <div className="meter-label">Confidence Level</div>
                <div className="meter-bar">
                  <div 
                    className="meter-fill" 
                    style={{width: `${result.probability * 100}%`}}
                  ></div>
                </div>
                <div className="meter-value">{(result.probability * 100).toFixed(1)}%</div>
              </div>
              
              <div className="recommendation">
                <h3>Recommendation</h3>
                <p>
                  {result.prediction === 1 
                    ? "Immediate medical consultation is strongly recommended. Please schedule an appointment with your healthcare provider for further evaluation and treatment planning."
                    : "The analysis suggests benign characteristics. However, regular monitoring and follow-up with your healthcare provider is still recommended."
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>Powered by Advanced AI & Machine Learning</p>
          <p>For medical use only - Always consult healthcare professionals</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
