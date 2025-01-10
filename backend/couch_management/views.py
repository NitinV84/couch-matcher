import cv2
import numpy as np
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from sklearn.metrics.pairwise import cosine_similarity

from couch_management.models import Sofa
from couch_management.serializers import SofaSerializer
from couch_management.utils import extract_image_features


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
        budget = request.query_params.get('budget', None)
        image_file = request.FILES.get('image', None)

        sofas = Sofa.objects.all()

        if budget:
            try:
                budget = int(budget)
                sofas = sofas.filter(price__lte=budget)
            except ValueError:
                 return Response({"error": "Invalid budget value."}, status=status.HTTP_400_BAD_REQUEST)

        
        if image_file:
            try:
                image_bytes = image_file.read()
                image_array = np.frombuffer(image_bytes, np.uint8)
                image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
            except Exception as e:
                return Response({"error": "Could not process the uploaded image."}, status=status.HTTP_400_BAD_REQUEST)

            uploaded_image_features = extract_image_features(image, return_as_bytes=False)
            if uploaded_image_features is None:
                return Response({"error": "Could not extract features from the uploaded image."}, status=status.HTTP_400_BAD_REQUEST)
        
            uploaded_image_features_np = np.array(uploaded_image_features).reshape(1, -1)
            
            similarities = []
            for sofa in sofas:
                if sofa.features:
                    try:
                        sofa_features_np = np.frombuffer(sofa.features, dtype=np.uint8).reshape(1, -1)
                        similarity_score = self.compare_images(uploaded_image_features_np, sofa_features_np)
                        if similarity_score >= 0.6:
                            similarities.append((sofa, similarity_score))
                    except Exception as e:
                        continue

            similarities.sort(key=lambda x: x[1], reverse=True)

            data = []
            for sofa, score in similarities:
                data.append({
                    "sofa": {
                        **SofaSerializer(sofa, context={'request': request}).data,
                        "similarity_score": float(score * 100)
                    }
                })

            if not data:
                return Response({"message": "No match data found"}, status=status.HTTP_404_NOT_FOUND)

            return Response(data)
        else:
            serializer = SofaSerializer(sofas, many=True, context={'request': request})
            return Response(serializer.data)

    def compare_images(self, image1_features, image2_features):
        """
        Compare two feature arrays using cosine similarity
        """
        if image1_features.size == 0 or image2_features.size == 0:
            return 0.0

        if image1_features.shape[1] != image2_features.shape[1]:
            min_features = min(image1_features.shape[1], image2_features.shape[1])
            image1_features = image1_features[:, :min_features]
            image2_features = image2_features[:, :min_features]
            
        similarity_score = cosine_similarity(image1_features, image2_features)[0][0]
        return similarity_score
