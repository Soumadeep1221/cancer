from keras.models import load_model

model = load_model("models/breast_cancer_model.h5")
print("Input shape:", model.input_shape)
