from django.shortcuts import render, get_object_or_404
from django.http import FileResponse, Http404, HttpResponse
from django.views.generic import TemplateView
import os
import mimetypes

from .models import (
    BrandPromotionalItem,
    BrandImageLibrary,
    BrandVideo,
    BrandGuidelineDocument,
    BrandCatalogue, TomoilLogoFullColor, TomoilLogo, TomoilGuideline, TomoilBrandingCards
)
from pageheader.models import PageHeader

class BrandPortalView(TemplateView):
    template_name = 'brand_list.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Mövcud brand məlumatları
        context['promotional_items'] = BrandPromotionalItem.objects.all()
        context['image_library'] = {
            'corporate': BrandImageLibrary.objects.filter(type='corporate'),
            'dealership': BrandImageLibrary.objects.filter(type='dealership'),
            'sponsorship': BrandImageLibrary.objects.filter(type='sponsorship'),
        }
        context['videos'] = BrandVideo.objects.all()
        context['brand_guidelines'] = BrandGuidelineDocument.objects.all()
        context['catalogues'] = BrandCatalogue.objects.all()

        context['tomoil_logos_full_color'] = TomoilLogoFullColor.objects.all()
        context['tomoil_logos_mono'] = TomoilLogo.objects.all()
        context['tomoil_guidelines'] = TomoilGuideline.objects.all()
        context['tomoil_branding_cards'] = TomoilBrandingCards.objects.all()

        active_tab = self.request.GET.get('tab', 'brand-guideline')
        context['active_tab'] = active_tab

        try:
            page_header = PageHeader.objects.get(page_key='brand_portal')
            context.update({
                'breadcrumb_title': page_header.breadcrumb_title,
                'breadcrumb_url': page_header.breadcrumb_url,
                'page_title': page_header.page_title,
                'page_description': page_header.page_description,
                'background_image': page_header.background_image
            })
        except PageHeader.DoesNotExist:
            context.update({
                'breadcrumb_title': 'Brand Portal',
                'breadcrumb_url': '/brand/',
                'page_title': 'Brand Portal',
                'page_description': 'Access our brand assets and guidelines.',
                'background_image': None
            })

        return context

def download_file(request, model_name, pk):
    model_map = {
        'promotional': BrandPromotionalItem,
        'image': BrandImageLibrary,
        'guideline': BrandGuidelineDocument,
        'catalogue': BrandCatalogue,
    }

    field_map = {
        'promotional': 'preview_image',
        'image': 'preview_image',
        'guideline': 'document',
        'catalogue': 'document',
    }

    if model_name not in model_map:
        raise Http404("Invalid model type")

    model = model_map[model_name]
    field = field_map[model_name]

    item = get_object_or_404(model, pk=pk)
    file_field = getattr(item, field)
    file_path = file_field.path

    if not os.path.exists(file_path):
        raise Http404("File not found.")

    filename = os.path.basename(file_path)
    return FileResponse(
        open(file_path, 'rb'),
        as_attachment=True,
        filename=filename
    )


def view_catalogue(request, catalogue_id):
    catalogue = get_object_or_404(BrandCatalogue, id=catalogue_id)
    file_path = catalogue.document.path

    if not os.path.exists(file_path):
        raise Http404("Dosya bulunamadı.")

    mime_type, _ = mimetypes.guess_type(file_path)
    if mime_type is None:
        mime_type = 'application/pdf'

    response = FileResponse(open(file_path, 'rb'), content_type=mime_type)

    response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'

    return response
