from keras.models import Sequential
from keras.layers import Dense, InputLayer
import os

_model = None

def get_model():
    global _model
    if _model is None:
        model_path = "models/breast_cancer_model.h5"
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        try:
            # Create model architecture manually to avoid batch_shape compatibility issues
            model = Sequential([
                InputLayer(input_shape=(30,)),  # 30 features for breast cancer prediction
                Dense(16, activation='relu'),
                Dense(8, activation='relu'),
                Dense(1, activation='sigmoid')
            ])
            
            # Load weights from the saved model
            model.load_weights(model_path)
            _model = model
            print("✓ Model loaded successfully with manual architecture")
            
        except Exception as e:
            print(f"Error loading model: {e}")
            raise e
            
    return _model