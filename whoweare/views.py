from django.shortcuts import render
from .models import VisionMission, Glance, OurCommitment


def glance_list(request):
    item = Glance.objects.last()
    return render(request, 'glance.html', {'item': item})


def vision_mision_list(request):
    item = VisionMission.objects.prefetch_related('values').last()
    return render(request, 'vision_mission.html', {'item': item})


def our_commitment_list(request):
    items = OurCommitment.objects.all()
    return render(request, 'our_commitment.html', {'items': items})
