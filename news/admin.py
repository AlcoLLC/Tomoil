from django.contrib import admin
from .models import News
from modeltranslation.admin import TranslationAdmin


@admin.register(News)
class NewsAdmin(TranslationAdmin):
    list_display = ('title', 'created_at', 'views_count')
    search_fields = ('title', 'header_text', 'description')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'
    readonly_fields = ('views_count',)
