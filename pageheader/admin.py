from django.contrib import admin
from .models import PageHeader
from modeltranslation.admin import TranslationAdmin

@admin.register(PageHeader)
class PageHeaderAdmin(TranslationAdmin):
    list_display = ('page_key', 'page_title', 'breadcrumb_title')
    search_fields = ('page_key', 'page_title', 'breadcrumb_title')
    list_filter = ('page_key',)
