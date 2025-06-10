from modeltranslation.translator import register, TranslationOptions
from .models import (
    Glance, GlanceGuide, VisionMission, Value, OurCommitment
)

@register(Glance)
class GlanceTranslationOptions(TranslationOptions):
    fields = ('title', 'header_text', 'description_header_text', 'description')


@register(GlanceGuide)
class GlanceGuideTranslationOptions(TranslationOptions):
    fields = ('guide', 'guide_text')


@register(VisionMission)
class VisionMissionTranslationOptions(TranslationOptions):
    fields = ('vision', 'mission')


@register(Value)
class ValueTranslationOptions(TranslationOptions):
    fields = ('title', 'description')


@register(OurCommitment)
class OurCommitmentTranslationOptions(TranslationOptions):
    fields = ('tab_title', 'title', 'header_description', 'description_title', 'description')