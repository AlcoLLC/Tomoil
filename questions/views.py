from django.shortcuts import render
from .models import Question
from pageheader.models import PageHeader


def faq_view(request):
    questions = Question.objects.all().order_by('-created_at')
    try:
        page_header = PageHeader.objects.get(page_key='faq_view')
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

    return render(request, 'faq.html', {'questions': questions, **header_context})
