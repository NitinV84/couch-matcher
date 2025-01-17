
import os

from django.conf import settings
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rembg import remove
import io
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from couch_management.keras import predict_image_class
from couch_management.models import Sofa
from couch_management.serializers import SofaSerializer
from couch_management.utils import (calculate_sofa_similarity,
                                    get_dominant_color)


class SofaListView(generics.ListAPIView):
    """
    View to list all sofas with pagination.
    """
    queryset = Sofa.objects.all()
    serializer_class = SofaSerializer


class SofaFilterAPIView(APIView):
    """
    API endpoint to retrieve sofas based on image similarity and/or budget.
    """
    parser_classes = [MultiPartParser]

    @extend_schema(
        summary="Retrieve sofas based on image similarity and/or budget with pagination",
        description="Uploads an image to find similar sofas based on stored features, and/or filters by price range. Each sofa includes a similarity score (if image provided) in the response.",
        parameters=[
            OpenApiParameter(name='budget', type=int, location=OpenApiParameter.QUERY, required=False, description='Maximum budget for sofas'),
        ],
        request={
            "multipart/form-data": {
                "type": "object",
                "properties": {
                    "image": {"type": "string", "format": "binary"},
                },
            }
        },
        responses={200: "List of sofas with similarity scores and pagination"},
    )
    def post(self, request, *args, **kwargs):
        try:
            budget = request.query_params.get('budget', None)
            image_file = request.FILES.get('image', None)

            sofas = Sofa.objects.all()

            if budget:
                sofas = sofas.filter(original_price__lte=float(budget))
            
            if image_file:
                temp_image_path = os.path.join(settings.MEDIA_ROOT, image_file.name)
                with open(temp_image_path, 'wb') as f:
                    for chunk in image_file.chunks():
                        f.write(chunk)

                predicted_class, _ = predict_image_class(temp_image_path)

                try:
                    with open(temp_image_path, 'rb') as input_file:
                        input_data = input_file.read()

                        output_data = remove(input_data)

                    output_image = io.BytesIO(output_data)
                    bg_removed_path = f"{temp_image_path}_no_bg.png"
                    output_image.seek(0)
                    with open(bg_removed_path, 'wb') as f:
                        f.write(output_data)
                except Exception as e:
                    return Response({"error": "Background removal failed. Please check the API or payment status."}, status=402)


                dominant_color = get_dominant_color(bg_removed_path)

                sofas = sofas.filter(features__class_name=predicted_class)

                sofas_with_similarity = []
                for sofa in sofas:
                    similarity_percentage = calculate_sofa_similarity(
                        predicted_class,
                        dominant_color,
                        sofa
                    )
                    sofas_with_similarity.append((sofa, similarity_percentage))

                sofas_with_similarity.sort(key=lambda x: x[1], reverse=True)

                data = []
                for sofa, score in sofas_with_similarity:
                    data.append({
                        "sofa": {
                            **SofaSerializer(sofa, context={'request': request}).data,
                            "similarity_score": score
                        }
                    })

                if not data:
                    return Response({"message": "No match data found"}, status=status.HTTP_404_NOT_FOUND)

                return Response(data)
            else:
                serializer = SofaSerializer(sofas, many=True, context={'request': request})
                return Response(serializer.data)

        except ValueError as e:
            return Response({"error": str(e)}, status=400)

        finally:
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)

            if os.path.exists(bg_removed_path):
                os.remove(bg_removed_path)
