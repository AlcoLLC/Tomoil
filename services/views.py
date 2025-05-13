from django.shortcuts import render
from .models import LubelQ, Services

def services_list(request):
    lubelq_item = LubelQ.objects.last()
    services_qs = Services.objects.all()

    services = {service.tab_title.lower(): service for service in services_qs}

    return render(request, 'services_list.html', {
        'lubelq': lubelq_item,
        'services': services,
    })
