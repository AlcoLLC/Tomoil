from django.urls import path
from .views import pds_sds_view, all_data_sheets_view, products_view, products_detail_view

app_name = 'products'

urlpatterns = [
    path("pds-sds/", pds_sds_view, name='pds_sds'),
    path("all-data-sheets/", all_data_sheets_view, name='all_data_sheets'),
    path("products/", products_view, name='products_list'),
    path("product/<slug:product_slug>/", products_detail_view, name='products_detail_view'),
    path("products/product-range/<slug:product_range_slug>/", products_view, name='products_by_range'),
    
    # Friendly URLs for application areas
    path("products/application-area/<slug:application_area_slug>/", products_view, name='products_by_application'),
    
    # Friendly URLs for specifications
    path("products/specification/<slug:specification_slug>/", products_view, name='products_by_specification'),
    
    # Friendly URLs for viscosities
    path("products/viscosity/<slug:viscosity_slug>/", products_view, name='products_by_viscosity'),
    
    # Friendly URLs for compositions
    path("products/composition/<slug:composition_slug>/", products_view, name='products_by_composition'),
    
    # Friendly URLs for pack sizes
    path("products/pack-size/<slug:pack_size_slug>/", products_view, name='products_by_pack_size'),
    
    # Product detail
    path("product/<slug:product_slug>/", products_detail_view, name='products_detail_view'),
]