from django.urls import path
from .views import faq_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('faq/', faq_view, name='faq'),
]
