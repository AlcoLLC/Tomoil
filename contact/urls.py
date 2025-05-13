from django.urls import path
from .views import index, home_view, validate_phone_api

urlpatterns = [
    path('contact/', index, name='contact'),
    path('validate-phone/', validate_phone_api, name='validate_phone'),
    path("", home_view)
]
