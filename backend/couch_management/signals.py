from pathlib import Path

from django.db.models.signals import post_save
from django.dispatch import receiver

from couch_management.keras import predict_image_class
from couch_management.models import Sofa
from couch_management.utils import get_dominant_color, rgb_to_color_description


@receiver(post_save, sender=Sofa)
def generate_features(sender, instance, created, **kwargs):
    """
    Signal to generate image features for a Sofa instance after it is created.

    Args:
        sender: The model class sending the signal.
        instance: The instance being saved.
        created: Boolean indicating if the instance was created.
        kwargs: Additional keyword arguments.
    """
    if created and instance.image:
        try:
            image_path = Path(instance.image.path)

            if image_path.exists():
                class_name, _ = predict_image_class(image_path)

                dominant_color_rgb = get_dominant_color(str(image_path))
                color_description = rgb_to_color_description(dominant_color_rgb)

                color_name = color_description.split(" (Hex: ")[0]
                hex_color = color_description.split(" (Hex: ")[1].split(",")[0]
                rgb_color = eval(color_description.split("RGB: ")[1][:-1])

                features = {
                    "class_name": class_name,
                    "color_name": color_name,
                    "hex_color": hex_color,
                    "rgb_color": rgb_color,
                }

                Sofa.objects.filter(pk=instance.pk).update(features=features)

        except Exception as e:
            raise Exception(f"Error generating features for Sofa instance: {e}")
