import React, { useState } from "react";

function App() {
  const [features, setFeatures] = useState("");
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    const featureArray = features.split(",").map(Number);
    const response = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: featureArray }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cancer Detection</h1>
      <input
        type="text"
        placeholder="Enter features separated by commas"
        value={features}
        onChange={(e) => setFeatures(e.target.value)}
        style={{ width: "300px" }}
      />
      <button onClick={handlePredict}>Predict</button>
      {result && (
        <div>
          <h3>Result: {result.prediction}</h3>
          <p>Score: {result.score.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}


export default App;
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

