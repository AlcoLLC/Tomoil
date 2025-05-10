from django.contrib import admin
from .models import VisionMission, Glance, OurCommitment


@admin.register(Glance)
class GlanceAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')


@admin.register(VisionMission)
class VisionMissionAdmin(admin.ModelAdmin):
    list_display = ('vision', 'mission')


@admin.register(OurCommitment)
class OurCommitmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')
