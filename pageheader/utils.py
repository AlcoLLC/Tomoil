from .models import PageHeader


def get_page_header(page_key, **kwargs):
    try:
        header = PageHeader.objects.get(page_key=page_key)
        context = {
            'breadcrumb_title': header.breadcrumb_title,
            'breadcrumb_url': header.breadcrumb_url,
            'page_title': header.page_title,
            'page_description': header.page_description,
            'header_bg_image': header.background_image if header.background_image else None
        }
    except PageHeader.DoesNotExist:
        context = {
            'breadcrumb_title': kwargs.get('breadcrumb_title', ''),
            'breadcrumb_url': kwargs.get('breadcrumb_url', '/'),
            'page_title': kwargs.get('page_title', ''),
            'page_description': kwargs.get('page_description', ''),
            'header_bg_image': None
        }

    return context
