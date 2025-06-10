from modeltranslation.translator import register, TranslationOptions
from .models import PageHeader

@register(PageHeader)
class PageHeaderTranslationOptions(TranslationOptions):
    fields = ('breadcrumb_title', 'page_title', 'page_description')
