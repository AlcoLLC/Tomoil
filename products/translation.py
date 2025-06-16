from modeltranslation.translator import register, TranslationOptions
from .models import ProductRange, Composition, Product, TypicalProperties

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