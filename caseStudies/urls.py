from django.urls import path
from .views import case_studies_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('case-studies/', case_studies_view, name='case_studies'),
]

urlpatterns += static(settings.MEDIA_URL,
                      document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL,
                      document_root=settings.STATIC_ROOT)
