from modeltranslation.translator import register, TranslationOptions, translator

from .models import ProductRange, ProductRangeCategory, Composition, Product, TypicalProperties, Review, ApplicationArea, Specification, Viscosity, PackSize

@register(ProductRange)
class ProductRangeTranslationOptions(TranslationOptions):
    fields = ('name', 'description', 'meta_title', 'meta_description')

class ProductRangeCategoryTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

translator.register(ProductRangeCategory, ProductRangeCategoryTranslationOptions)

@register(Composition)
class CompositionTranslationOptions(TranslationOptions):
    fields = ('name', 'meta_title', 'meta_description')

@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ('description', 'features_benefits', 'application', 'meta_title', 'meta_description', 'meta_keywords')

@register(TypicalProperties)
class TypicalPropertiesTranslationOptions(TranslationOptions):
    fields = ('property',)

@register(Review)
class ReviewTranslationOptions(TranslationOptions):
    fields = ('summary', 'review')

@register(ApplicationArea)
class ApplicationAreaTranslationOptions(TranslationOptions):
    fields = ('name', 'meta_title', 'meta_description')

@register(Specification)
class SpecificationTranslationOptions(TranslationOptions):
    fields = ('meta_title', 'meta_description')

@register(Viscosity)
class ViscosityTranslationOptions(TranslationOptions):
    fields = ('meta_title', 'meta_description')

@register(PackSize)
class PackSizeTranslationOptions(TranslationOptions):
    fields = ('meta_title', 'meta_description')