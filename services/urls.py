from django.urls import path
from . import views

urlpatterns = [
    path('services/', views.services_list, name='services_list'),
]
