from django.contrib import admin
from .models import BrandPromotionalItem


@admin.register(BrandPromotionalItem)
class BrandPromotionalItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'width', 'height')
    readonly_fields = ('width', 'height')
