from django.urls import path

from couch_management.views import SofaFilterAPIView, SofaListView

urlpatterns = [
    path('api/sofas/', SofaListView.as_view(), name='sofa-list'),
    path('api/sofas/matching/', SofaFilterAPIView.as_view(), name='sofa-matching'),
]