from django.shortcuts import render
from .models import CaseStudy
from .filters import CaseStudyFilter
from django.shortcuts import get_object_or_404, render
from django.core.paginator import Paginator


def case_studies_view(request):
    case_studies = CaseStudy.objects.all().order_by('-created_at')

    case_study_filter = CaseStudyFilter(request.GET, queryset=case_studies)
    filtered_case_studies = case_study_filter.qs

    page_number = request.GET.get('page', 1)

    paginator = Paginator(filtered_case_studies, 8)
    page_obj = paginator.get_page(page_number)
    from_date = request.GET.get('from_date', '')

    formatted_date = ''
    if from_date:
        try:
            date_parts = from_date.split('-')
            if len(date_parts) == 3:
                formatted_date = f"{date_parts[2]}.{date_parts[1]}.{date_parts[0]}"
        except:
            formatted_date = from_date

    return render(request, 'case_studies.html', {
        'filter': case_study_filter,
        'page_obj': page_obj,
        'total_results': paginator.count,
        'formatted_date': formatted_date,
    })


def case_study_detail(request, pk):
    case_study = get_object_or_404(CaseStudy, pk=pk)
    return render(request, 'case_study_detail.html', {'case_study': case_study})
