from modeltranslation.translator import register, TranslationOptions
from .models import (
    BrandPromotionalItem, BrandImageLibrary, BrandVideo, 
    BrandGuidelineDocument, BrandCatalogue, TomoilLogoFullColor,
    TomoilGuideline, TomoilBrandingCards
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
    fields = ('title', )


@register(BrandCatalogue)
class BrandCatalogueTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

@register(TomoilLogoFullColor)
class TomoilLogoFullColorTranslationOptions(TranslationOptions):
    fields = ('title', 'description')

# @register(TomoilLogo)
# class TomoilLogoTranslationOptions(TranslationOptions):
#     fields = ('description', )


@register(TomoilGuideline)
class TomoilGuidelineTranslationOptions(TranslationOptions):
    fields = ('title', 'description', 'logo_title', 'logo_description')


@register(TomoilBrandingCards)
class TomoilBrandingCardsTranslationOptions(TranslationOptions):
    fields = ('description', )
