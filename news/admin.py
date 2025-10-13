from django.contrib import admin
from .models import News
from modeltranslation.admin import TranslationAdmin


@admin.register(News)
class NewsAdmin(TranslationAdmin):
    list_display = ('title', 'created_at', 'views_count', 'in_home')
    search_fields = ('title', 'header_text', 'description')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'
    readonly_fields = ('views_count',)

    class Media:
        js = (
            'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
            'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js',
            'modeltranslation/js/tabbed_translation_fields.js',
        )
        css = {
            'all': ('admin/css/news_admin.css',),
            'screen': ('modeltranslation/css/tabbed_translation_fields.css',),
        }
