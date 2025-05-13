from .models import BrandVideo
from django.shortcuts import render
from django.http import FileResponse, Http404
import os
from django.views.generic import ListView
from .models import BrandPromotionalItem, BrandImageLibrary
from django.shortcuts import get_object_or_404

# Brand Promotional Item


class BrandPromotionalListView(ListView):
    model = BrandPromotionalItem
    template_name = 'brand_list.html'
    context_object_name = 'items'


def download_brand_promotional_item(request, pk):
    from .models import BrandPromotionalItem
    item = get_object_or_404(BrandPromotionalItem, pk=pk)
    file_path = item.preview_image.path

    if not os.path.exists(file_path):
        raise Http404("File not found.")

    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))

# Brand Image Library


class BrandImageLibraryListView(ListView):
    model = BrandImageLibrary
    template_name = 'brand_image_library_list.html'
    context_object_name = 'images'


def download_brand_image_library_item(request, pk):
    from .models import BrandImageLibrary
    item = get_object_or_404(BrandImageLibrary, pk=pk)
    file_path = item.preview_image.path

    if not os.path.exists(file_path):
        raise Http404("File not found.")

    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=os.path.basename(file_path))

# Videos tab


def brand_videos_view(request):
    videos = BrandVideo.objects.all()
    return render(request, 'brand_videos.html', {'videos': videos})
