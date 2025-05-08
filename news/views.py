from django.shortcuts import render, get_object_or_404
from .models import News
from django.db.models import Q
from django.core.paginator import Paginator
from datetime import datetime


def news_list(request):
    query = request.GET.get('q', '')
    sort_by = request.GET.get('sort', 'relevance')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    per_page = request.GET.get('per_page', 12)

    news_items = News.objects.all()

    if query:
        news_items = news_items.filter(
            Q(title__icontains=query) |
            Q(header_text__icontains=query) |
            Q(description__icontains=query)
        )

    if start_date and end_date:
        try:
            start = datetime.strptime(start_date, '%d.%m.%Y')
            end = datetime.strptime(end_date, '%d.%m.%Y')
            news_items = news_items.filter(created_at__range=(start, end))
        except ValueError:
            pass

    if sort_by == 'latest':
        news_items = news_items.order_by('-created_at')
    elif sort_by == 'oldest':
        news_items = news_items.order_by('created_at')
    elif sort_by == 'a_to_z':
        news_items = news_items.order_by('title')

    paginator = Paginator(news_items, per_page)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'news_list.html', {
        'page_obj': page_obj,
        'query': query,
        'sort_by': sort_by
    })


def news_detail(request, pk):
    news_item = get_object_or_404(News, pk=pk)
    return render(request, 'news_detail.html', {'news': news_item})
