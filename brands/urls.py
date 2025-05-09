from django.urls import path
from .views import (
    BrandPromotionalListView,
    BrandImageLibraryListView,
    download_brand_promotional_item,
    download_brand_image_library_item
)

urlpatterns = [
    path('brand/promotional/', BrandPromotionalListView.as_view(),
         name='brand_promotional_list'),
    path('brand/image-library/', BrandImageLibraryListView.as_view(),
         name='brand_image_library_list'),

    path('download/promotional/<int:pk>/',
         download_brand_promotional_item, name='download_promotional'),
    path('download/image-library/<int:pk>/',
         download_brand_image_library_item, name='download_image_library'),
]
