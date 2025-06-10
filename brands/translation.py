from modeltranslation.translator import register, TranslationOptions
from .models import (
    BrandPromotionalItem, BrandImageLibrary, BrandVideo, 
    BrandGuidelineDocument, BrandCatalogue
)


@register(BrandPromotionalItem)
class BrandPromotionalItemTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(BrandImageLibrary)
class BrandImageLibraryTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(BrandVideo)
class BrandVideoTranslationOptions(TranslationOptions):
    fields = ('title',)


@register(BrandGuidelineDocument)
class BrandGuidelineDocumentTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


@register(BrandCatalogue)
class BrandCatalogueTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

