from django.urls import path
from .views import pds_sds_view, all_data_sheets_view, products_view, products_detail_view

urlpatterns = [
    path("pds_sds", pds_sds_view, name='pds_sds'),
    path("all_data_sheets/", all_data_sheets_view, name='all_data_sheets'),
    path("products/", products_view, name='products'),
    path("products_detail/", products_detail_view, name='products_detail'),
]
