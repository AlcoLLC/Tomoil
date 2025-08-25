from modeltranslation.translator import register, TranslationOptions, translator

from .models import ProductRange, ProductRangeCategory, Composition, Product, TypicalProperties, Review, ApplicationArea

@register(ProductRange)
class ProductRangeTranslationOptions(TranslationOptions):
    fields = ('name', 'description',)

class ProductRangeCategoryTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

translator.register(ProductRangeCategory, ProductRangeCategoryTranslationOptions)

@register(Composition)
class CompositionTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ('description', 'features_benefits', 'application')

@register(TypicalProperties)
class TypicalPropertiesTranslationOptions(TranslationOptions):
    fields = ('property',)

@register(Review)
class ReviewTranslationOptions(TranslationOptions):
    fields = ('summary', 'review')

@register(ApplicationArea)
class ApplicationAreaTranslationOptions(TranslationOptions):
    fields = ('name',)

