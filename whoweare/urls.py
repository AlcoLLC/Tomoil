from django.urls import path
from . import views

urlpatterns = [
    path('glance/', views.glance_list, name='glance'),
    path('vision_mission/', views.vision_mision_list, name='vision_mission')
]
