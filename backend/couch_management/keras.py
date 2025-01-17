import os

import numpy as np
from django.conf import settings
from PIL import Image, ImageOps

from keras.models import load_model


def load_keras_model(model_path):
    """
    Load the Keras model from the specified file path.

    Args:
        model_path (str): The path to the .h5 model file.

    Returns:
        model: The loaded Keras model.
    """
    model = load_model(model_path, compile=False)
    return model

def predict_image_class(image_path):
    """
    Predict the class of the input image using the trained Keras model.

    Args:
        image_path (str): Path to the image you want to predict.

    Returns:
        str: The predicted class name.
        float: The confidence score of the prediction.
    """
    model_path = os.path.join(settings.BASE_DIR, 'couch_management/keras_model.h5')
    labels_path = os.path.join(settings.BASE_DIR, 'couch_management/labels.txt')

    model = load_keras_model(model_path)

    with open(labels_path, "r") as f:
        class_names = [line.strip().split(" ", 1)[1] for line in f.readlines()]

    image = Image.open(image_path).convert("RGB")
    size = (224, 224)
    image = ImageOps.fit(image, size, Image.Resampling.LANCZOS)
    image_array = np.asarray(image)
    normalized_image_array = (image_array.astype(np.float32) / 127.5) - 1

    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    data[0] = normalized_image_array

    prediction = model.predict(data)
    index = np.argmax(prediction)
    class_name = class_names[index].strip()
    confidence_score = prediction[0][index]

    print(f"Predicted class: {class_name}, Confidence: {confidence_score}")

    return class_name, confidence_score
