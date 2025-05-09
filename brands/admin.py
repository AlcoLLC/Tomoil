from django.contrib import admin
from .models import BrandPromotionalItem, BrandImageLibrary, BrandVideo


@admin.register(BrandPromotionalItem)
class BrandPromotionalItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'width', 'height')
    readonly_fields = ('width', 'height')


@admin.register(BrandImageLibrary)
class BrandImageLibraryAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'width', 'height')
    list_filter = ('type',)
    search_fields = ('title',)


@admin.register(BrandVideo)
class BrandVideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'video_url')
