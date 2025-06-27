from modeltranslation.translator import register, TranslationOptions
from .models import ProductRange, Composition, Product, TypicalProperties, Review, ApplicationArea

@register(ProductRange)
class ProductRangeTranslationOptions(TranslationOptions):
    fields = ('name', 'description',)

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