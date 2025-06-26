from keras.models import load_model

_model = None

def get_model():
    global _model
    if _model is None:
        _model = load_model("models/breast_cancer_model.h5")
    return _model