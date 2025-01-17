import cv2
import numpy as np
import webcolors


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


def get_dominant_color(image_path, k=3):
    """
    Detect the dominant color in an image while ignoring transparent or white background.

    Args:
        image_path (str): Path to the input image.
        k (int): Number of clusters for K-means.

    Returns:
        tuple: The dominant color in RGB format.
    """
    image = cv2.imread(image_path, cv2.IMREAD_UNCHANGED)

    if image is None:
        raise ValueError(f"Image at path '{image_path}' could not be loaded.")

    if image.shape[2] == 4:
        bgr, alpha = image[:, :, :3], image[:, :, 3]
        mask = alpha > 0
    else:
        bgr = image
        mask = np.all(bgr != [255, 255, 255], axis=-1)

    rgb_image = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    sofa_pixels = rgb_image[mask]

    if sofa_pixels.size == 0:
        raise ValueError("No sofa pixels found. Ensure the sofa is present in the image.")

    sofa_pixels = np.float32(sofa_pixels)
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
    _, labels, palette = cv2.kmeans(sofa_pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

    _, counts = np.unique(labels, return_counts=True)

    dominant_color = palette[np.argmax(counts)]

    return tuple(map(int, dominant_color))


def closest_css3_color(rgb_color):
    """
    Find the closest CSS3 color name for a given RGB color.

    Args:
        rgb_color (tuple): The RGB color (R, G, B).

    Returns:
        str: The closest CSS3 color name.
    """
    min_distance = float('inf')
    closest_name = None

    for name in webcolors.names():
        try:
            r_c, g_c, b_c = webcolors.name_to_rgb(name)
            distance = ((r_c - rgb_color[0]) ** 2 +
                        (g_c - rgb_color[1]) ** 2 +
                        (b_c - rgb_color[2]) ** 2)**0.5
            if distance < min_distance:
                min_distance = distance
                closest_name = name
        except ValueError:
            continue

    return closest_name


def rgb_to_color_description(rgb_color):
    """
    Convert an RGB color to a human-readable description (name and hex).

    Args:
        rgb_color (tuple): The RGB color (R, G, B).

    Returns:
        str: A description of the color (name and hex code).
    """
    try:
      color_name = webcolors.rgb_to_name(rgb_color)
      hex_color = webcolors.rgb_to_hex(rgb_color)
    except ValueError:
      color_name = closest_css3_color(rgb_color)
      hex_color = webcolors.name_to_hex(color_name)

    return f"{color_name} (Hex: {hex_color}, RGB: {rgb_color})"



def calculate_color_similarity(rgb1, rgb2):
    rgb1_normalized = np.array(rgb1) / 255.0
    rgb2_normalized = np.array(rgb2) / 255.0
    return np.linalg.norm(rgb1_normalized - rgb2_normalized)


def calculate_sofa_similarity(predicted_class, predicted_color_rgb, predicted_color_name, sofa):
    class_name_weight = 0.4
    color_name_weight = 0.3
    color_similarity_weight = 0.3

    class_name_similarity = 1 if sofa.features['class_name'] == predicted_class else 0

    color_name_similarity = 1 if sofa.features['color_name'].lower() == predicted_color_name.lower() else 0

    color_similarity = calculate_color_similarity(sofa.features['rgb_color'], predicted_color_rgb)
    color_similarity = max(0, 1 - color_similarity)

    total_similarity = (class_name_similarity * class_name_weight) + \
                       (color_name_similarity * color_name_weight) + \
                       (color_similarity * color_similarity_weight)

    similarity_percentage = total_similarity * 100
    return similarity_percentage