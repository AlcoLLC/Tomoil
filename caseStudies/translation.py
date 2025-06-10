from modeltranslation.translator import register, TranslationOptions
from .models import CaseStudy

@register(CaseStudy)
class CaseStudyTranslationOptions(TranslationOptions):
    fields = ('title', 'header_text', 'description')
