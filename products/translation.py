from modeltranslation.translator import register, TranslationOptions
from .models import (
    ProductRange, ApplicationArea, Viscosity, 
    Composition, Product, TypicalProperties
)

@register(ProductRange)
class ProductRangeTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(ApplicationArea)
class ApplicationAreaTranslationOptions(TranslationOptions):
    fields = ('name',)


@register(Viscosity)
class ViscosityTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(Composition)
class CompositionTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'features_benefits', 'application')


@register(TypicalProperties)
class TypicalPropertiesTranslationOptions(TranslationOptions):
    fields = ('property',)