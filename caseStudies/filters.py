import django_filters
from .models import CaseStudy


class CaseStudyFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='gte',
        label='From date',
        input_formats=['%d.%m.%Y', '%Y-%m-%d'],
    )

    class Meta:
        model = CaseStudy
        fields = ['from_date']
