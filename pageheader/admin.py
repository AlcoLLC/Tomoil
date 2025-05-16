from django.contrib import admin
from .models import PageHeader


@admin.register(PageHeader)
class PageHeaderAdmin(admin.ModelAdmin):
    list_display = ('page_key', 'page_title', 'breadcrumb_title')
    search_fields = ('page_key', 'page_title', 'breadcrumb_title')
    list_filter = ('page_key',)
    fieldsets = (
        (None, {
            'fields': ('page_key',)
        }),
        ('Breadcrumb', {
            'fields': ('breadcrumb_title', 'breadcrumb_url')
        }),
        ('Header Content', {
            'fields': ('page_title', 'page_description', 'background_image')
        }),
    )
