from modeltranslation.translator import register, TranslationOptions
from .models import HomeSwiper, TomoilReview

@register(HomeSwiper)
class HomeSwiperTranslationOptions(TranslationOptions):
    fields = ('title', 'title_description', 'description', 'link')

@register(TomoilReview)
class TomoilReviewTranslationOptions(TranslationOptions):
    fields = ('name', 'position', 'review')
