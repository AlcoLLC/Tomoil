import django_filters
from .models import CaseStudy


class CaseStudyFilter(django_filters.FilterSet):
    created_at = django_filters.DateFilter(
        field_name='created_at', lookup_expr='date')

    class Meta:
        model = CaseStudy
        fields = ['created_at']
