from django.contrib import admin
from .models import CaseStudy
from modeltranslation.admin import TranslationAdmin


@admin.register(CaseStudy)
class CaseStudyAdmin(TranslationAdmin):
    list_display = ('title', 'created_at', 'is_home')
    search_fields = ('title', 'header_text', 'description')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'
