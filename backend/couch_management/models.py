from django.core.validators import MaxValueValidator
from django.db import models

from couch_management.utils import calculate_original_price


class Sofa(models.Model):
    """
    Represents a sofa product in the database.

    Attributes:
        name (str): The name of the sofa.
        image (ImageField): The image of the sofa.
        price (float): The real price of the sofa.
        original_price (float): The price of the sofa after discount.
        discount (float): The discount applied to the sofa in percent.
        quantity (int): The quantity of the sofa in stock.
        description (str): A brief description of the sofa.
        features (JSONField): A json field to store image features.
    """
    name = models.CharField(max_length=255)
    image = models.ImageField(upload_to='sofa_images/')
    price = models.FloatField()
    original_price = models.FloatField()
    discount = models.FloatField(default=0, validators=[MaxValueValidator(100)])
    quantity = models.IntegerField(default=1)
    description = models.TextField(null=True, blank=True)
    features = models.JSONField(null=True, blank=True)

    def save(self, *args, **kwargs):
        """
        Saves the sofa instance to the database.

        Calculates the original price based on the price and discount.
        """
        self.original_price = calculate_original_price(self.price, self.discount)
        super(Sofa, self).save(*args, **kwargs)

    def __str__(self) -> str:
        """
        Returns a string representation of the sofa instance.

        Returns:
            str: The name of the sofa.
        """
        return f"{self.name}"
