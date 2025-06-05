from django.shortcuts import render, get_object_or_404
from django.db.models import Q, Avg
from django.core.paginator import Paginator
from pageheader.models import PageHeader
from .models import (
    Product, ProductRange, ApplicationArea, Specification, 
    Viscosity, Composition, PackSize, Review
)

def pds_sds_view(request):
    try:
        page_header = PageHeader.objects.get(page_key='pds_sds_view')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'PDS & SDS',
            'breadcrumb_url': '/pds_sds/',
            'page_title': 'PDS & SDS',
            'page_description': '',
            'background_image': None
        }

    return render(request, 'pds&sds.html', {**header_context})

def all_data_sheets_view(request):
    try:
        page_header = PageHeader.objects.get(page_key='all_data_sheets_view')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'All Data Sheets',
            'breadcrumb_url': '/all_data_sheets/',
            'page_title': 'All Data Sheets',
            'page_description': '',
            'background_image': None
        }

    return render(request, 'all_data_sheets.html', {**header_context})

def products_view(request):
    try:
        page_header = PageHeader.objects.get(page_key='products_view')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Products',
            'breadcrumb_url': '/products/',
            'page_title': 'Products',
            'page_description': '',
            'background_image': None
        }

    product_ranges = request.GET.getlist('product_range')
    application_areas = request.GET.getlist('application_area')
    specifications = request.GET.getlist('specification')
    viscosities = request.GET.getlist('viscosity')
    compositions = request.GET.getlist('composition')
    pack_sizes = request.GET.getlist('pack_size')
    search_query = request.GET.get('search', '')

    products = Product.objects.filter(is_active=True)

    if product_ranges:
        products = products.filter(product_range__id__in=product_ranges)
    
    if application_areas:
        products = products.filter(application_areas__id__in=application_areas)
    
    if specifications:
        products = products.filter(specifications__id__in=specifications)
    
    if viscosities:
        products = products.filter(viscosities__id__in=viscosities)
    
    if compositions:
        products = products.filter(compositions__id__in=compositions)
    
    if pack_sizes:
        products = products.filter(pack_sizes__id__in=pack_sizes)
    
    if search_query:
        products = products.filter(
            Q(title__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(product_id__icontains=search_query) |
            Q(features_benefits__icontains=search_query) |
            Q(application__icontains=search_query)
        )

    products = products.distinct().prefetch_related(
        'product_range', 'application_areas', 'specifications', 
        'viscosities', 'compositions', 'pack_sizes'
    )

    paginator = Paginator(products, 12) 
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        **header_context,
        'products': page_obj,
        'product_ranges': ProductRange.objects.filter(is_active=True).order_by('order', 'name'),
        'application_areas': ApplicationArea.objects.filter(is_active=True),
        'specifications': Specification.objects.filter(is_active=True).order_by('name'),
        'viscosities': Viscosity.objects.filter(is_active=True).order_by('name'),
        'compositions': Composition.objects.filter(is_active=True).order_by('name'),
        'pack_sizes': PackSize.objects.filter(is_active=True).order_by('size'),
        'selected_product_ranges': [str(id) for id in product_ranges],
        'selected_application_areas': [str(id) for id in application_areas],
        'selected_specifications': [str(id) for id in specifications],
        'selected_viscosities': [str(id) for id in viscosities],
        'selected_compositions': [str(id) for id in compositions],
        'selected_pack_sizes': [str(id) for id in pack_sizes],
        'search_query': search_query,
        'total_products': products.count(),
    }

    return render(request, 'products.html', context)

def products_detail_view(request, product_id):
    product = get_object_or_404(
        Product.objects.prefetch_related(
            'application_areas', 'specifications', 'viscosities', 
            'compositions', 'pack_sizes', 'typical_properties', 
            'packaging_sizes', 'reviews'
        ), 
        product_id=product_id, 
        is_active=True
    )
    
    try:
        page_header = PageHeader.objects.get(page_key='products_detail_view')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': product.title,
            'page_description': product.description or page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Product Detail',
            'breadcrumb_url': f'/products/{product_id}/',
            'page_title': product.title,
            'page_description': product.description or '',
            'background_image': None
        }

    reviews = product.reviews.filter(is_approved=True).order_by('-created_at')
    
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    if avg_rating:
        avg_rating = round(avg_rating, 1)

    context = {
        **header_context,
        'product': product,
        'reviews': reviews[:5],
        'reviews_count': reviews.count(),
        'avg_rating': avg_rating,
        'typical_properties': product.typical_properties.all().order_by('order'),
        'packaging_sizes': product.packaging_sizes.all().order_by('order'),
        'performance': getattr(product, 'performance', None),
    }

    return render(request, 'products_single_page.html', context)