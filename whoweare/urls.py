from django.urls import path
from . import views

urlpatterns = [
    path('glance/', views.Glance, name='glance'),
    path('vision_mission/', views.VisionMission, name='vision_mission')
]
