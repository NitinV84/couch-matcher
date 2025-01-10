from pathlib import Path

from django.db.models.signals import post_save
from django.dispatch import receiver

from couch_management.models import Sofa
from couch_management.utils import extract_image_features


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
            if Path(instance.image.path).exists():
                features = extract_image_features(image_path=instance.image.path, return_as_bytes=True)
                if features:
                    Sofa.objects.filter(pk=instance.pk).update(features=features)
        except Exception as e:
            raise Exception(f"Error extracting image features: {e}")
