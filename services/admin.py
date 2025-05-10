from django.contrib import admin
from .models import LubelQ, Services


@admin.register(LubelQ)
class LubelQAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')


@admin.register(Services)
class ServicesAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')
