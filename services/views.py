from django.shortcuts import render
from .models import LubelQ, Services


def lubelq_list(request):
    items = LubelQ.objects.all()
    return render(request, 'lubelq_list.html', {'items': items})


def services_list(request):
    items = Services.objects.all()
    return render(request, 'services_list.html', {'items': items})

