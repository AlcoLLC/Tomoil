from django.utils.dateparse import parse_date
from django.core.paginator import Paginator
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import News
from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.http import require_http_methods
import json


@require_http_methods(["GET"])
def news_api(request):
    try:
        news_items = News.objects.all()

        sort_by = request.GET.get("sort_by", "Relevance")
        if sort_by.lower() == "latest":
            news_items = news_items.order_by("-created_at")
        elif sort_by.lower() == "oldest":
            news_items = news_items.order_by("created_at")
        elif sort_by.lower() == "from a to z":
            news_items = news_items.order_by("title")
        else:  # Default is Relevance
            news_items = news_items.order_by("-views_count")

        from_date = request.GET.get("from_date")
        to_date = request.GET.get("to_date")

        if from_date:
            parts = from_date.split('.')
            if len(parts) == 3:
                formatted_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                news_items = news_items.filter(
                    created_at__date__gte=formatted_date)

        if to_date:
            parts = to_date.split('.')
            if len(parts) == 3:
                formatted_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                news_items = news_items.filter(
                    created_at__date__lte=formatted_date)

        news_data = json.loads(serialize('json', news_items))

        formatted_news = []
        for item in news_data:
            news_dict = {
                'id': item['pk'],
                **item['fields'],
                'image_one': request.build_absolute_uri('/media/' + item['fields']['image_one']),
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
    sort_by = request.GET.get("sort_by", "relevance")
    per_page = int(request.GET.get("per_page", 12))
    from_date = request.GET.get("from_date")
    to_date = request.GET.get("to_date")

    news_items = News.objects.all()

    if from_date:
        parsed_from = parse_date(from_date.replace('.', '-'))
        if parsed_from:
            news_items = news_items.filter(created_at__gte=parsed_from)

    if to_date:
        parsed_to = parse_date(to_date.replace('.', '-'))
        if parsed_to:
            news_items = news_items.filter(created_at__lte=parsed_to)

    if sort_by.lower() == "latest":
        news_items = news_items.order_by("-created_at")
    elif sort_by.lower() == "oldest":
        news_items = news_items.order_by("created_at")
    elif sort_by.lower() == "from a to z":
        news_items = news_items.order_by("title")
    else:
        news_items = news_items.order_by("-views_count")

    paginator = Paginator(news_items, per_page)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context = {
        "page_obj": page_obj,
        "total_results": paginator.count,
        "formatted_date": from_date or "",
        "sort_by": sort_by,
        "per_page": per_page,
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
