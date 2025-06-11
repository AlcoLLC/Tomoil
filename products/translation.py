from modeltranslation.translator import register, TranslationOptions
from .models import (
    ProductRange, ApplicationArea, Specification, Viscosity, 
    Composition, Product, Performance, TypicalProperties
)

@register(ProductRange)
class ProductRangeTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(ApplicationArea)
class ApplicationAreaTranslationOptions(TranslationOptions):
    fields = ('name',)

@register(Specification)
class SpecificationTranslationOptions(TranslationOptions):
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

@register(Performance)
class PerformanceTranslationOptions(TranslationOptions):
    fields = ('specifications', 'recommendation')

@register(TypicalProperties)
class TypicalPropertiesTranslationOptions(TranslationOptions):
    fields = ('property',)