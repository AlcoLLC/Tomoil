from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'news'

urlpatterns = [
    path('news/', views.news_list, name='news_list'),
    path('api/news/', views.news_api, name='news_api'),
    path('news/<slug:slug>/', views.news_detail, name='news_detail'),
]

urlpatterns += static(settings.MEDIA_URL,
                      document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL,
                      document_root=settings.STATIC_ROOT)
