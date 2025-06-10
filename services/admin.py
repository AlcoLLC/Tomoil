from django.contrib import admin
from django.db import models
from .models import LubelQ, Services
from modeltranslation.admin import TranslationAdmin
from ckeditor_uploader.widgets import CKEditorUploadingWidget


@admin.register(LubelQ)
class LubelQAdmin(TranslationAdmin):
    list_display = ('title', 'testing_instruments', 'test_parameters', 'accuracy_rate')
    search_fields = ('title', 'header_text', 'description_header_text')
    list_filter = ('testing_instruments', 'test_parameters', 'accuracy_rate')
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget},
    }
    

@admin.register(Services)
class ServicesAdmin(TranslationAdmin):
    list_display = ('tab_title', 'title')
    search_fields = ('tab_title', 'title', 'description')
    
    formfield_overrides = {
        models.TextField: {'widget': CKEditorUploadingWidget},
    }
    
