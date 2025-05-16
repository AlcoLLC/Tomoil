from django.shortcuts import render
from .models import VisionMission, Glance, OurCommitment
from pageheader.models import PageHeader


def glance_list(request):
    item = Glance.objects.last()
    try:
        page_header = PageHeader.objects.get(page_key='glance_list')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Tomoil at a Glance',
            'breadcrumb_url': '/glance/',
            'page_title': 'Glance',
            'page_description': '',
            'background_image': None
        }

    return render(request, 'glance.html', {'item': item, **header_context})


def vision_mision_list(request):
    item = VisionMission.objects.prefetch_related('values').last()
    try:
        page_header = PageHeader.objects.get(page_key='vision_mision_list')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Vision, Mission & Values',
            'breadcrumb_url': '/vision_mission/',
            'page_title': 'Vision, Mission & Values',
            'page_description': '',
            'background_image': None
        }

    return render(request, 'vision_mission.html', {'item': item, **header_context})


def our_commitment_list(request):
    items = OurCommitment.objects.all()
    try:
        page_header = PageHeader.objects.get(page_key='our_commitment_list')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Our Commitments',
            'breadcrumb_url': '/our_commitment/',
            'page_title': 'Our Commitments',
            'page_description': '',
            'background_image': None
        }

    return render(request, 'our_commitment.html', {'items': items, **header_context})
