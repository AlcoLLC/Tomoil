from .models import Glance, GlanceGuide
from django.contrib import admin
from .models import VisionMission, Glance, OurCommitment


@admin.register(VisionMission)
class VisionMissionAdmin(admin.ModelAdmin):
    list_display = ('vision', 'mission')


@admin.register(OurCommitment)
class OurCommitmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'description')


class GlanceGuideInline(admin.TabularInline):
    model = GlanceGuide
    extra = 1


@admin.register(Glance)
class GlanceAdmin(admin.ModelAdmin):
    inlines = [GlanceGuideInline]


admin.site.register(GlanceGuide)
