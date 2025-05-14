from django.shortcuts import render
from .models import VisionMission, Glance, OurCommitment


def glance_list(request):
    item = Glance.objects.last()
    return render(request, 'glance.html', {'item': item})


def vision_mision_list(request):
    items = VisionMission.objects.last()
    return render(request, 'vision_mision.html', {'items': items})


def our_commitment_list(request):
    items = OurCommitment.objects.last()
    return render(request, 'our_commitment.html', {'items': items})
