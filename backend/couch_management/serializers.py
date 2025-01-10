from rest_framework import serializers

from couch_management.models import Sofa


class SofaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sofa
        fields = ['name', 'image', 'price', 'original_price', 'quantity', 'discount', 'description']
    
    def get_image(self, obj):
        request = self.context.get('request')
        if request and obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be a positive number.")
        return value  
