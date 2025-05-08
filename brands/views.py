from django.shortcuts import render
from .models import BrandPromotionalItem

def brand_promotional_items_view(request):
    items = BrandPromotionalItem.objects.all().order_by('-id')
    return render(request, 'brand_promotional_items.html', {'items': items})
