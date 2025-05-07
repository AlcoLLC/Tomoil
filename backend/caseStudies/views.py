from django.shortcuts import render
from .models import CaseStudy
from .filters import CaseStudyFilter


def case_studies_view(request):
    case_studies = CaseStudy.objects.all().order_by('-created_at')
    case_study_filter = CaseStudyFilter(request.GET, queryset=case_studies)
    return render(request, 'case_studies.html', {'filter': case_study_filter})
