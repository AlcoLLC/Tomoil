from modeltranslation.translator import register, TranslationOptions
from .models import LubelQ, Services


@register(LubelQ)
class LubelQTranslationOptions(TranslationOptions):
    fields = ('title', 'header_text', 'description_header_text', 'description')


@register(Services)
class ServicesTranslationOptions(TranslationOptions):
    fields = ('tab_title', 'title', 'description')
