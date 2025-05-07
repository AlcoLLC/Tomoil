from django.urls import path
from .views import index, home_view

urlpatterns = [
    path('contact/', index, name='contact'),
    path("", home_view)
]
