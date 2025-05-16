from django.shortcuts import render
from .models import CaseStudy
from .filters import CaseStudyFilter
from django.shortcuts import get_object_or_404, render
from django.core.paginator import Paginator
from pageheader.models import PageHeader


def case_studies_view(request):
    case_studies = CaseStudy.objects.all().order_by('-created_at')

    from_date = request.GET.get('from_date', '')

    if from_date:
        try:
            if '.' in from_date:
                day, month, year = from_date.split('.')
                formatted_date = f"{year}-{month}-{day}"
                case_studies = case_studies.filter(
                    created_at__gte=formatted_date)
            elif '-' in from_date:
                case_studies = case_studies.filter(created_at__gte=from_date)
        except (ValueError, IndexError):
            pass

    page_number = request.GET.get('page', 1)
    paginator = Paginator(case_studies, 6)

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

    try:
        page_header = PageHeader.objects.get(page_key='case_studies_view')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Case Studies',
            'breadcrumb_url': '/case-studies/',
            'page_title': 'Case Studies',
            'page_description': '',
            'background_image': None
        }

    return render(request, 'case_studies.html', {
        'page_obj': page_obj,
        'total_results': paginator.count,
        'formatted_date': formatted_display_date,
        **header_context
    })


def case_study_detail(request, pk):
    case_study = get_object_or_404(CaseStudy, pk=pk)
    return render(request, 'case_study_detail.html', {'case_study': case_study})
