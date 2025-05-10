import django_filters
from .models import CaseStudy
from django import forms

class CaseStudyFilter(django_filters.FilterSet):
    from_date = django_filters.DateFilter(
        field_name='created_at',
        lookup_expr='gte',
        label='From date',
        input_formats=['%d.%m.%Y', '%Y-%m-%d'],
        widget=forms.DateInput(attrs={'placeholder': 'DD.MM.YYYY'})
    )

    class Meta:
        model = CaseStudy
        fields = ['from_date']
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'from_date' in self.form.fields:
            self.form.fields['from_date'].required = False