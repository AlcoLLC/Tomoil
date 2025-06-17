from .models import Glance, GlanceGuide
from django.contrib import admin
from django.db import models
from .models import VisionMission, Value, Glance, GlanceGuide, OurCommitment
from modeltranslation.admin import TranslationAdmin, TranslationTabularInline
from ckeditor_uploader.widgets import CKEditorUploadingWidget


class GlanceGuideInline(TranslationTabularInline):
    model = GlanceGuide
    extra = 1
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget},
    }


@admin.register(Glance)
class GlanceAdmin(TranslationAdmin):
    list_display = ('title', 'description_header_text')
    search_fields = ('title', 'header_text', 'description_header_text')
    inlines = [GlanceGuideInline]
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget},
    }
    

class ValueInline(TranslationTabularInline):
    model = Value
    extra = 1
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget},
    }


@admin.register(VisionMission)
class VisionMissionAdmin(TranslationAdmin):
    list_display = ('vision', 'mission', 'image')
    inlines = [ValueInline]
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget},
    }
    

@admin.register(OurCommitment)
class OurCommitmentAdmin(TranslationAdmin):
    list_display = ('tab_title', 'title', 'description_title')
    search_fields = ('tab_title', 'title', 'description_title')
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget},
    }
    
