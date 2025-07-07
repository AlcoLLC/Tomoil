from django.urls import path
from . import views

app_name = 'whoweare'

urlpatterns = [
    path('glance/', views.glance_list, name='glance'),
    path('vision-mission/', views.vision_mision_list, name='vision_mission'),
    path('our-commitment/', views.our_commitment_list, name='our_commitment_list')
]
