import cv2


def calculate_original_price(price, discount):
    """
    Calculates the original price of an item given its current price and discount percentage.
    
    Args:
        price (float): The current price of the item.
        discount (float): The discount percentage on the item.
    
    Returns:
        float: The original price of the item.
    """
    return price - (price * discount / 100)



def extract_image_features(image=None, image_path=None, return_as_bytes=True):
    """
    Extracts features from an image file or OpenCV image object.

    Args:
        image (numpy.ndarray, optional): OpenCV image object.
        image_path (Path, optional): Path to the image file.
        return_as_bytes (bool, optional): Flag indicating whether to return the features as bytes or as a list.

    Returns:
        bytes or list: The extracted features as bytes or as a list.
    """
    try:
        if image_path:
            image = cv2.imread(str(image_path), cv2.IMREAD_GRAYSCALE)
            if image is None:
                raise ValueError("Failed to load image from the given path.")

        if image is None:
            raise ValueError("No image data provided.")

        orb = cv2.ORB_create()
        _, descriptors = orb.detectAndCompute(image, None)

        if descriptors is not None:
            if return_as_bytes:
                return descriptors.flatten().tobytes()
            return descriptors.flatten().tolist()
        return None
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None
