from django.contrib import admin
from .models import BrandPromotionalItem, BrandImageLibrary, BrandVideo, BrandCatalogue, BrandGuidelineDocument, TomoilLogoFullColor, TomoilLogo, TomoilGuideline, TomoilBrandingCards
from modeltranslation.admin import TranslationAdmin
from django.contrib import messages


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
    

@admin.register(TomoilLogoFullColor)
class TomoilLogoFullColorAdmin(TranslationAdmin):
    list_display = ['title', 'description']
    search_fields = ['title', 'description']
    fields = ['title', 'description', 'logo', 'logo_pdf']
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        count = TomoilLogoFullColor.objects.count()
        extra_context['title'] = f'Tomoil Full Color Logos ({count}/2)'
        if count >= 2:
            messages.warning(request, 'Maximum limit reached (2/2). You cannot add more Full Color logos.')
        return super().changelist_view(request, extra_context=extra_context)
    
    def has_add_permission(self, request):
        return TomoilLogoFullColor.objects.count() < 2

@admin.register(TomoilLogo)
class TomoilLogoAdmin(TranslationAdmin):
    list_display = ['description']
    search_fields = ['description']
    fields = ['description', 'logo']
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        count = TomoilLogo.objects.count()
        extra_context['title'] = f'Tomoil Monochrome Logos ({count}/4)'
        if count >= 4:
            messages.warning(request, 'Maximum limit reached (4/4). You cannot add more Monochrome logos.')
        return super().changelist_view(request, extra_context=extra_context)
    
    def has_add_permission(self, request):
        return TomoilLogo.objects.count() < 4

@admin.register(TomoilGuideline)
class TomoilGuidelineAdmin(TranslationAdmin):
    list_display = ['title', 'logo_title']
    search_fields = ['title', 'logo_title', 'description']
    fields = ['title', 'description', 'logo_title', 'logo_description', 'logo_pdf', 'logo_png']
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        count = TomoilGuideline.objects.count()
        extra_context['title'] = f'Tomoil Guidelines ({count}/1)'
        if count >= 1:
            messages.warning(request, 'Maximum limit reached (1/1). You cannot add more Guidelines.')
        return super().changelist_view(request, extra_context=extra_context)
    
    def has_add_permission(self, request):
        return TomoilGuideline.objects.count() < 1

@admin.register(TomoilBrandingCards)
class TomoilBrandingCardsAdmin(TranslationAdmin):
    list_display = ['description']
    search_fields = ['description']
    fields = ['description', 'image']
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        count = TomoilBrandingCards.objects.count()
        extra_context['title'] = f'Tomoil Branding Cards ({count}/4)'
        if count >= 4:
            messages.warning(request, 'Maximum limit reached (4/4). You cannot add more Branding Cards.')
        return super().changelist_view(request, extra_context=extra_context)
    
    def has_add_permission(self, request):
        return TomoilBrandingCards.objects.count() < 4