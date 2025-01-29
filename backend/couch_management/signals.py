import os
from pathlib import Path

from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rembg import remove

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
                with open(image_path, 'rb') as input_file:
                    input_data = input_file.read()
                    output_data = remove(input_data)
                
                output_image_path = Path(settings.MEDIA_ROOT) / f"{image_path.stem}_no_bg{image_path.suffix}"
                with open(output_image_path, 'wb') as output_file:
                    output_file.write(output_data)

                sofa_type, _ = predict_image_class(output_image_path)
                dominant_color_rgb = get_dominant_color(str(output_image_path))
                color_description = rgb_to_color_description(dominant_color_rgb)
                color_name = color_description.split(" (Hex: ")[0]
                hex_color = color_description.split(" (Hex: ")[1].split(",")[0]

                features = {
                    "sofa_type": sofa_type,
                    "color_name": color_name,
                    "hex_color": hex_color,
                    "rgb_color": dominant_color_rgb,
                }

                Sofa.objects.filter(pk=instance.pk).update(features=features)

                if os.path.exists(output_image_path):
                    os.remove(output_image_path)

        except Exception as e:
            raise Exception(f"Error generating features for Sofa instance: {e}")
