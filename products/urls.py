from django.urls import path
from .views import pds_sds_view, all_data_sheets_view, products_view, products_detail_view

app_name = 'products'

urlpatterns = [
    path("pds_sds", pds_sds_view, name='pds_sds'),
    path("all_data_sheets/", all_data_sheets_view, name='all_data_sheets'),
    path("products/", products_view, name='products_list'),
    path("product/<str:product_id>/", products_detail_view, name='product_detail'),
]
