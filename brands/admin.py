from django.contrib import admin
from .models import BrandPromotionalItem, BrandImageLibrary, BrandVideo, BrandCatalogue, BrandGuidelineDocument
from modeltranslation.admin import TranslationAdmin


@admin.register(BrandPromotionalItem)
class BrandPromotionalItemAdmin(TranslationAdmin):
    list_display = ('title', 'width', 'height')
    list_filter = ('width', 'height')
    search_fields = ('title',)
    readonly_fields = ('width', 'height')
    


@admin.register(BrandImageLibrary)
class BrandImageLibraryAdmin(TranslationAdmin):
    list_display = ('title', 'type', 'width', 'height')
    list_filter = ('type', 'width', 'height')
    search_fields = ('title',)
    readonly_fields = ('width', 'height')
    
@admin.register(BrandVideo)
class BrandVideoAdmin(TranslationAdmin):
    list_display = ('title', 'video_url')
    search_fields = ('title',)
    


@admin.register(BrandGuidelineDocument)
class BrandGuidelineDocumentAdmin(TranslationAdmin):
    list_display = ('title', 'file_type')
    list_filter = ('file_type',)
    search_fields = ('title', 'description')
    
  

@admin.register(BrandCatalogue)
class BrandCatalogueAdmin(TranslationAdmin):
    list_display = ('title', 'description')
    search_fields = ('title', 'description')
    
