from modeltranslation.translator import register, TranslationOptions
from .models import News

@register(News)
class NewsTranslationOptions(TranslationOptions):
    fields = ('title', 'header_text', 'description', 'meta_title', 'meta_description', 'meta_keywords')

