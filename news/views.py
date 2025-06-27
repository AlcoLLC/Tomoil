from django.utils.dateparse import parse_date
from django.core.paginator import Paginator
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import News
from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.http import require_http_methods
from django.db.models import Q
import json
from pageheader.models import PageHeader


@require_http_methods(["GET"])
def news_api(request):
    try:
        news_items = News.objects.all()

        # Handle search functionality
        search_query = request.GET.get("search", "").strip()
        if search_query:
            news_items = news_items.filter(
                Q(title__icontains=search_query) | 
                Q(description__icontains=search_query)
            )

        sort_by = request.GET.get("sort_by", "relevance")
        if sort_by.lower() == "latest":
            news_items = news_items.order_by("-created_at")
        elif sort_by.lower() == "oldest":
            news_items = news_items.order_by("created_at")
        elif sort_by.lower() == "from a to z":
            news_items = news_items.order_by("title")
        else:
            news_items = news_items.order_by("-views_count")

        from_date = request.GET.get("from_date")
        to_date = request.GET.get("to_date")

        if from_date:
            try:
                # Handle dd.mm.yyyy format
                parts = from_date.split('.')
                if len(parts) == 3:
                    formatted_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                    parsed_date = parse_date(formatted_date)
                    if parsed_date:
                        news_items = news_items.filter(created_at__date__gte=parsed_date)
            except (ValueError, IndexError):
                pass  # Invalid date format, ignore

        if to_date:
            try:
                # Handle dd.mm.yyyy format
                parts = to_date.split('.')
                if len(parts) == 3:
                    formatted_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                    parsed_date = parse_date(formatted_date)
                    if parsed_date:
                        news_items = news_items.filter(created_at__date__lte=parsed_date)
            except (ValueError, IndexError):
                pass  # Invalid date format, ignore

        news_data = json.loads(serialize('json', news_items))

        formatted_news = []
        for item in news_data:
            news_dict = {
                'id': item['pk'],
                **item['fields'],
                'image_one': request.build_absolute_uri('/media/' + item['fields']['image_one']) if item['fields'].get('image_one') else '',
            }

            if item['fields'].get('image_two'):
                news_dict['image_two'] = request.build_absolute_uri(
                    '/media/' + item['fields']['image_two'])

            if item['fields'].get('image_three'):
                news_dict['image_three'] = request.build_absolute_uri(
                    '/media/' + item['fields']['image_three'])

            formatted_news.append(news_dict)

        return JsonResponse(formatted_news, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


def news_list(request):
    # Get all parameters
    sort_by = request.GET.get("sort_by", "relevance")
    per_page = int(request.GET.get("per_page", 12))
    from_date = request.GET.get("from_date", "").strip()
    to_date = request.GET.get("to_date", "").strip()
    search_query = request.GET.get("search", "").strip()

    news_items = News.objects.all()

    # Apply search filter
    if search_query:
        news_items = news_items.filter(
            Q(title__icontains=search_query) | 
            Q(description__icontains=search_query)
        )

    # Apply date filters
    if from_date:
        try:
            # Handle dd.mm.yyyy format
            parts = from_date.split('.')
            if len(parts) == 3:
                formatted_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                parsed_from = parse_date(formatted_date)
                if parsed_from:
                    news_items = news_items.filter(created_at__date__gte=parsed_from)
        except (ValueError, IndexError):
            pass  # Invalid date format, ignore

    if to_date:
        try:
            # Handle dd.mm.yyyy format
            parts = to_date.split('.')
            if len(parts) == 3:
                formatted_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                parsed_to = parse_date(formatted_date)
                if parsed_to:
                    news_items = news_items.filter(created_at__date__lte=parsed_to)
        except (ValueError, IndexError):
            pass  # Invalid date format, ignore

    # Apply sorting
    if sort_by.lower() == "latest":
        news_items = news_items.order_by("-created_at")
    elif sort_by.lower() == "oldest":
        news_items = news_items.order_by("created_at")
    elif sort_by.lower() == "from a to z":
        news_items = news_items.order_by("title")
    else:
        news_items = news_items.order_by("-views_count")

    # Pagination
    paginator = Paginator(news_items, per_page)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    # Page header
    try:
        page_header = PageHeader.objects.get(page_key='news_list')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'News',
            'breadcrumb_url': '/news/',
            'page_title': 'Latest News',
            'page_description': 'Stay updated with the latest news and developments from our company.',
            'background_image': None
        }

    start_index = (page_obj.number - 1) * per_page + 1
    end_index = min(page_obj.number * per_page, paginator.count)

    context = {
        "news_items": page_obj,
        "page_obj": page_obj,
        "total_count": paginator.count,  
        "start_index": start_index,  
        "end_index": end_index,
        "formatted_date": from_date or "",
        "sort_by": sort_by,
        "per_page": per_page,
        "search_query": search_query,  # Add search query to context
        "from_date": from_date,       # Add from_date to context
        "to_date": to_date,           # Add to_date to context
        **header_context
    }

    return render(request, "news_list.html", context)


def news_detail(request, pk):
    try:
        news_item = News.objects.get(pk=pk)

        news_item.views_count += 1
        news_item.save(update_fields=['views_count'])

        return render(request, 'news_detail.html', {
            'news_item': news_item
        })
    except News.DoesNotExist:
        return HttpResponse('News article not found', status=404)