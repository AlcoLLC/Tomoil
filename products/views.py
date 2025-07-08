from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
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
            'breadcrumb_url': '/pds-sds/',
            'page_title': 'PDS & SDS Search',
            'page_description': 'Find the product data sheets and safety data sheets you need.',
            'background_image': None
        }

    context = {
        **header_context,
        'search_product_name': '',
        'search_product_id': '',
        'search_document_type': 'all',
    }
    
    return render(request, 'pds&sds.html', context)

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
            'breadcrumb_url': '/all-data-sheets/',
            'page_title': 'All Data Sheets',
            'page_description': 'Browse all available product and safety data sheets.',
            'background_image': None
        }

    product_name = request.GET.get('product_name', '').strip()
    product_id = request.GET.get('product_id', '').strip()
    document_type = request.GET.get('document_type', 'all')

    is_search = bool(product_name or product_id)

    if is_search:
        header_context['page_title'] = 'Search Results'
        header_context['breadcrumb_title'] = 'Search Results'

    base_query = Q(is_active=True) & (Q(pds__isnull=False, pds__gt='') | Q(sds__isnull=False, sds__gt=''))
    
    search_query = Q()
    if product_name:
        search_query &= Q(title__icontains=product_name)
    if product_id:
        search_query &= Q(product_id__icontains=product_id)
    if document_type == 'pds':
        search_query &= Q(pds__isnull=False, pds__gt='')
    elif document_type == 'sds':
        search_query &= Q(sds__isnull=False, sds__gt='')

    final_query = base_query & search_query
    products = Product.objects.filter(final_query).order_by('title')

    data_sheets_list = []
    for product in products:
        data_sheets_list.append({
            'product_id': product.product_id,
            'product_name': product.title,
            'language': 'English',
            'has_pds': bool(product.pds),
            'has_sds': bool(product.sds),
            'pds_url': product.pds,
            'sds_url': product.sds,
        })

    paginator = Paginator(data_sheets_list, 15) 
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    context = {
        **header_context,   
        'data_sheets': page_obj,
        'results_count': paginator.count,
        'is_search': is_search,
        'search_product_name': product_name,
        'search_product_id': product_id,
        'search_document_type': document_type,
    }

    return render(request, 'all_data_sheets.html', context)


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

    product_range_slugs = request.GET.getlist('product_range')
    application_area_slugs = request.GET.getlist('application_area')
    specification_slugs = request.GET.getlist('specification')
    viscosity_slugs = request.GET.getlist('viscosity')
    composition_slugs = request.GET.getlist('composition')
    pack_size_slugs = request.GET.getlist('pack_size')
    search_query = request.GET.get('search', '')

    products = Product.objects.filter(is_active=True).order_by('order')

    from_date = request.GET.get('from_date', '')

    if from_date:
        try:
            if '.' in from_date:
                day, month, year = from_date.split('.')
                formatted_date = f"{year}-{month}-{day}"
                products = products.filter(
                    created_at__gte=formatted_date)
            elif '-' in from_date:
                products = products.filter(created_at__gte=from_date)
        except (ValueError, IndexError):
            pass

    if product_range_slugs:
        products = products.filter(product_range__slug__in=product_range_slugs)
    
    if application_area_slugs:
        products = products.filter(application_areas__slug__in=application_area_slugs)
    
    if specification_slugs:
        products = products.filter(specifications__slug__in=specification_slugs)
    
    if viscosity_slugs:
        products = products.filter(viscosities__slug__in=viscosity_slugs)
    
    if composition_slugs:
        products = products.filter(compositions__slug__in=composition_slugs)
    
    if pack_size_slugs:
        products = products.filter(pack_sizes__slug__in=pack_size_slugs)
    
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

    page_number = request.GET.get('page', 1)
    paginator = Paginator(products, 12)

    try:
        page_obj = paginator.get_page(page_number)
    except (ValueError, TypeError):
        page_obj = paginator.get_page(1)

    formatted_display_date = ''
    if from_date:
        if '.' in from_date:
            formatted_display_date = from_date
        elif '-' in from_date:
            try:
                year, month, day = from_date.split('-')
                formatted_display_date = f"{day}.{month}.{year}"
            except (ValueError, IndexError):
                formatted_display_date = from_date

    context = {
        **header_context,
        'products': page_obj,
        'product_ranges': ProductRange.objects.filter(is_active=True).order_by('order', 'name'),
        'application_areas': ApplicationArea.objects.filter(is_active=True).order_by('order'),
        'specifications': Specification.objects.filter(is_active=True).order_by('name'),
        'viscosities': Viscosity.objects.filter(is_active=True).order_by('name'),
        'compositions': Composition.objects.filter(is_active=True).order_by('order'),
        'pack_sizes': PackSize.objects.filter(is_active=True).order_by('order'),
        'selected_product_ranges': product_range_slugs,
        'selected_application_areas': application_area_slugs,
        'selected_specifications': specification_slugs,
        'selected_viscosities': viscosity_slugs,
        'selected_compositions': composition_slugs,
        'selected_pack_sizes': pack_size_slugs,
        'search_query': search_query,
        'formatted_date': formatted_display_date,
        'total_results': paginator.count,
    }

    return render(request, 'products.html', context)

def products_detail_view(request, product_slug):
    product = get_object_or_404(
        Product.objects.prefetch_related(
            'application_areas', 'specifications', 'viscosities', 
            'compositions', 'pack_sizes', 'typical_properties', 
            'packaging_sizes', 'reviews'
        ), 
    slug=product_slug, 
    is_active=True
)
    
    if request.method == 'POST':
        try:
            rating_value = request.POST.get('rating')
            if not rating_value:
                messages.error(request, 'Please select a rating.')
                return redirect('products:products_detail_view', product_slug=product_slug)

            review = Review(
                product=product,
                first_name=request.POST.get('first_name'),
                surname=request.POST.get('surname'),
                email_address=request.POST.get('email_address'),
                summary=request.POST.get('summary'),
                review=request.POST.get('review'),
                rating=int(rating_value), 
                is_approved=False  
            )
            
            review.full_clean() 
            review.save()
            messages.success(request, 'Thank you for your review! It will be published after approval.')
            return redirect('products:products_detail_view', product_slug=product_slug)
        except ValueError:
            messages.error(request, 'Invalid rating value submitted. Please select a rating.')
        except Exception as e:
            messages.error(request, f'There was an error submitting your review: {e}')
    
    
    try:
        page_header = PageHeader.objects.get(page_key='products_detail_view')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': product.title,
            'page_description': product.product_id,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Products',
            'breadcrumb_url': '/products/',
            'page_title': product.title,
            'page_description': product.product_id or '',
            'background_image': None
        }

    reviews = product.reviews.filter(is_approved=True).order_by('-created_at')
    
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
    if avg_rating:
        avg_rating = round(avg_rating, 1)

    context = {
        **header_context,
        'product': product,
        'reviews': reviews[:10], 
        'reviews_count': reviews.count(),
        'avg_rating': avg_rating,
        'typical_properties': product.typical_properties.all().order_by('order'),
        'packaging_sizes': product.packaging_sizes.all().order_by('order'),
        'performance': getattr(product, 'performance', None),
    }

    return render(request, 'products_single_page.html', context)