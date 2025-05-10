from django.urls import path
from . import views

urlpatterns = [
    path('lubelq/', views.lubelq_list, name='lubelq_list'),
    path('services/', views.services_list, name='services_list'),
]
