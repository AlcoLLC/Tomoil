from django.urls import path
from .views import pds_sds_view, all_data_sheets_view, products_view, products_detail_view

app_name = 'products'

urlpatterns = [
    path("pds-sds/", pds_sds_view, name='pds_sds'),
    path("all-data-sheets/", all_data_sheets_view, name='all_data_sheets'),
    path("products/", products_view, name='products_list'),
    path("product/<slug:product_slug>/", products_detail_view, name='products_detail_view'),
    path("products/product-range/<slug:product_range_slug>/", products_view, name='products_by_range'),
    path("products/application-area/<slug:application_area_slug>/", products_view, name='products_by_application'),
]