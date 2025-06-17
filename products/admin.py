from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import (
    ProductRange, ApplicationArea, Specification, Viscosity, 
    Composition, PackSize, Product, TypicalProperties, 
    PackagingSizes, Review
)

@admin.register(ProductRange)
class ProductRangeAdmin(TranslationAdmin):
    list_display = ('name', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'name_en')
    list_editable = ('order', 'is_active')

@admin.register(ApplicationArea)
class ApplicationAreaAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'is_home', 'order')
    list_filter = ('is_active',)
    search_fields = ('name',)
    list_editable = ('is_active',)

@admin.register(Specification)
class SpecificationAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)
    list_editable = ('is_active',)

@admin.register(Viscosity)
class ViscosityAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)
    list_editable = ('is_active',)

@admin.register(Composition)
class CompositionAdmin(TranslationAdmin):
    list_display = ('name', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('name', 'name_en')
    list_editable = ('is_active',)

@admin.register(PackSize)
class PackSizeAdmin(admin.ModelAdmin):
    list_display = ('size', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('size',)
    list_editable = ('is_active',)

class TypicalPropertiesInline(admin.TabularInline):
    model = TypicalProperties
    extra = 1
    fields = ('property', 'unit', 'test_method', 'typical_value', 'order')

class PackagingSizesInline(admin.TabularInline):
    model = PackagingSizes
    extra = 1
    fields = ('size', 'packaging_type', 'units_per_box', 'boxes_per_pallet', 'units_per_pallet', 'order')

@admin.register(Product)
class ProductAdmin(TranslationAdmin):
    list_display = ('title', 'product_id', 'product_range', 'is_active', 'created_at')
    list_filter = ('is_active', 'product_range', 'created_at')
    search_fields = ('title', 'product_id', 'description', 'description_en')
    list_editable = ('is_active',)
    filter_horizontal = ('application_areas', 'specifications', 'viscosities', 'compositions', 'pack_sizes')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description',  'product_id', 'image', 'is_active', 'is_home', 'order', 'slug')
        }),
        ('Documents', {
            'fields': ('pds', 'sds')
        }),
        ('Content', {
            'fields': ('features_benefits', 'application')
        }),
        ('Classifications', {
            'fields': ('product_range', 'application_areas', 'specifications', 'recommendation', 'viscosities', 'compositions', 'pack_sizes')
        }),
    )
    
    inlines = [TypicalPropertiesInline, PackagingSizesInline]


@admin.register(TypicalProperties)
class TypicalPropertiesAdmin(TranslationAdmin):
    list_display = ('product', 'property', 'unit', 'typical_value', 'order')
    list_filter = ('product',)
    search_fields = ('product__title', 'property')
    list_editable = ('order',)

@admin.register(PackagingSizes)
class PackagingSizesAdmin(admin.ModelAdmin):
    list_display = ('product', 'size', 'packaging_type', 'units_per_box', 'units_per_pallet', 'order')
    list_filter = ('packaging_type', 'product')
    search_fields = ('product__title', 'size')
    list_editable = ('order',)

@admin.register(Review)
class ReviewAdmin(TranslationAdmin):
    list_display = ('full_name', 'product', 'rating', 'is_approved', 'created_at')
    list_filter = ('rating', 'is_approved', 'created_at', 'product')
    search_fields = ('first_name', 'surname', 'email_address', 'product__title')
    list_editable = ('is_approved',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Review Information', {
            'fields': ('product', 'rating', 'summary', 'review', 'is_approved')
        }),
        ('Reviewer Information', {
            'fields': ('first_name', 'surname', 'email_address')
        }),
        ('Timestamps', {
            'fields': ('created_at',)
        }),
    )