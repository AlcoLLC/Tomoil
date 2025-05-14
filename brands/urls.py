from django.urls import path
from . import views

app_name = 'brand_portal'

urlpatterns = [
    path('brand/', views.BrandPortalView.as_view(), name='brand_portal'),
    path('download/<str:model_name>/<int:pk>/',
         views.download_file, name='download_file'),
    path('catalogue/view/<int:catalogue_id>/',
         views.view_catalogue, name='view_catalogue'),

]
