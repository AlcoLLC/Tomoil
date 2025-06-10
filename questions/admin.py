from django.contrib import admin
from .models import Question
from modeltranslation.admin import TranslationAdmin


@admin.register(Question)
class QuestionAdmin(TranslationAdmin):
    list_display = ('question', 'created_at')
    search_fields = ('question', 'answer')
    list_filter = ('created_at',)
    date_hierarchy = 'created_at'
    
