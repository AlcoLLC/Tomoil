from django.contrib import admin
from .models import Contact, HomeSwiper


@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email',
                    'contact_number', 'enquiry_type')

@admin.register(HomeSwiper)
class HomeSwiperAdmin(admin.ModelAdmin):
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