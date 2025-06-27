import os
import h5py
import numpy as np

print("Step 1: Checking model file...")
model_path = "models/breast_cancer_model.h5"
if os.path.exists(model_path):
    print(f"✓ Model file exists: {model_path}")
else:
    print(f"✗ Model file not found: {model_path}")
    exit(1)

print("\nStep 2: Examining model structure...")
try:
    with h5py.File(model_path, 'r') as f:
        print(f"Keys: {list(f.keys())}")
        if 'model_weights' in f:
            print("✓ Model weights found")
        if 'optimizer_weights' in f:
            print("✓ Optimizer weights found")
except Exception as e:
    print(f"✗ Error reading model file: {e}")
    exit(1)

print("\nStep 3: Testing TensorFlow/Keras import...")
try:
    import tensorflow as tf
    print(f"✓ TensorFlow version: {tf.__version__}")
    import keras
    print(f"✓ Keras version: {keras.__version__}")
except Exception as e:
    print(f"✗ Error importing TensorFlow/Keras: {e}")
    exit(1)

print("\nStep 4: Testing model loading...")
try:
    from keras.models import load_model
    print("✓ Keras load_model imported successfully")
    
    # Try loading with compile=False
    model = load_model(model_path, compile=False)
    print("✓ Model loaded successfully with compile=False")
    print(f"Input shape: {model.input_shape}")
    print(f"Output shape: {model.output_shape}")
    
    # Test prediction
    test_input = np.random.random((1, 30))
    prediction = model.predict(test_input)
    print(f"✓ Test prediction successful: {prediction}")
    
except Exception as e:
    print(f"✗ Error loading model: {e}")
    
    print("\nStep 5: Trying alternative approach...")
    try:
        from keras.models import Sequential
        from keras.layers import Dense, InputLayer
        
        # Create model architecture manually
        model = Sequential([
            InputLayer(input_shape=(30,)),
            Dense(16, activation='relu'),
            Dense(8, activation='relu'),
            Dense(1, activation='sigmoid')
        ])
        
        print("✓ Manual model created")
        print(f"Input shape: {model.input_shape}")
        print(f"Output shape: {model.output_shape}")
        
        # Try to load weights
        model.load_weights(model_path)
        print("✓ Weights loaded successfully")
        
        # Test prediction
        test_input = np.random.random((1, 30))
        prediction = model.predict(test_input)
        print(f"✓ Test prediction successful: {prediction}")
        
    except Exception as e2:
        print(f"✗ Alternative approach failed: {e2}")
        exit(1)

print("\n✓ All tests completed successfully!") 