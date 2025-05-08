from django.urls import path
from .views import brand_promotional_items_view

urlpatterns = [
    path('promotional-items/', brand_promotional_items_view,
         name='brand_promotional_items'),
]
