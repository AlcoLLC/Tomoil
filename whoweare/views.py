from django.shortcuts import render
from .models import VisionMission, Glance, OurCommitment


def glance_list(request):
    items = Glance.objects.all()
    return render(request, 'glance.html', {'items': items})


def vision_mision_list(request):
    items = VisionMission.objects.all()
    return render(request, 'vision_mision.html', {'items': items})


def our_commitment_list(request):
    items = OurCommitment.objects.all()
    return render(request, 'our_commitment.html', {'items': items})
