from django.shortcuts import render
from .models import LubelQ, Services
from pageheader.models import PageHeader

def services_list(request):
    lubelq_item = LubelQ.objects.last()
    services_qs = Services.objects.all()

    services = {service.tab_title.lower(): service for service in services_qs}

    try:
        page_header = PageHeader.objects.get(page_key='services_list')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Services',
            'breadcrumb_url': '/services/',
            'page_title': 'Services',
            'page_description': '',
            'background_image': None
        }

    return render(request, 'services_list.html', {
        'lubelq': lubelq_item,
        'services': services,
        **header_context
    })
