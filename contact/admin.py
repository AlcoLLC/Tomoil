from django.contrib import admin
from .models import Contact, HomeSwiper, CarLogo, PartnerLogo, TomoilReview, Footer
from modeltranslation.admin import TranslationAdmin


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email',
                    'contact_number', 'enquiry_type')

@admin.register(HomeSwiper)
class HomeSwiperAdmin(TranslationAdmin):
    list_display = ('title', 'order', 'is_active', 'image_preview')
    list_filter = ('is_active',)
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'description')
    ordering = ('order',)
    
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('title', 'image', 'order', 'is_active')
        }),
        ('İçerik', {
            'fields': ('description', 'title_description', 'link')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />'
        return "No Image"
    image_preview.allow_tags = True
    image_preview.short_description = 'Önizleme'
    
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

@admin.register(CarLogo)
class CarLogoAdmin(admin.ModelAdmin):
    list_display = ( 'image', 'order', 'is_active')
    list_filter = ('is_active',)
    list_editable = ('order', 'is_active')


@admin.register(PartnerLogo)
class PartnerLogoAdmin(admin.ModelAdmin):
    list_display = ( 'image', 'order', 'is_active')
    list_filter = ('is_active',)
    list_editable = ('order', 'is_active')

@admin.register(TomoilReview)
class TomoilReviewAdmin(TranslationAdmin):
    list_display = ('name', 'created_at', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'review')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'image', 'is_active', 'position')
        }),
        ('Contents', {
            'fields': ('review',)
        }),
    )

@admin.register(Footer)
class FooterAdmin(admin.ModelAdmin):
    list_display = ('email',)
