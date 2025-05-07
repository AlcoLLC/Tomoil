from django.urls import path
from .views import faq_view

urlpatterns = [
    path('faq/', faq_view, name='faq'),
]
