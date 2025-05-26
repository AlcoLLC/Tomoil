from django.shortcuts import render
from pageheader.models import PageHeader


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
            'breadcrumb_url': '/all_data_sheets/ ',
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

    return render(request, 'products.html', {**header_context})


def products_detail_view(request):
    try:
        page_header = PageHeader.objects.get(page_key='products_detail_view')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Faq',
            'breadcrumb_url': '/faq/',
            'page_title': 'Frequently Asked Questions',
            'page_description': '',
            'background_image': None
        }

    return render(request, 'products_single_page.html', {**header_context})
