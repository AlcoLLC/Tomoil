from django.shortcuts import render
from django.db.models import Q
from django.core.paginator import Paginator
from django.utils.translation import get_language

from products.models import (
    ProductRange, ApplicationArea, Specification, Viscosity, 
    Composition, PackSize, Product, TypicalProperties, 
    PackagingSizes, Review
)
from brands.models import (
    BrandPromotionalItem, BrandImageLibrary, BrandVideo,
    BrandGuidelineDocument, BrandCatalogue
)
from caseStudies.models import CaseStudy
from contact.models import HomeSwiper, TomoilReview
from news.models import News
from pageheader.models import PageHeader
from questions.models import Question
from services.models import LubelQ, Services
from whoweare.models import Glance, GlanceGuide, VisionMission, Value, OurCommitment


def create_search_queries(query):
    """
    Create multiple search queries from the input:
    1. Full query
    2. Individual words
    3. Partial matches for each word
    """
    queries = []
    
    # Add the full query
    queries.append(query.strip())
    
    # Split by spaces and add individual words (minimum 2 characters)
    words = [word.strip() for word in query.split() if len(word.strip()) >= 2]
    queries.extend(words)
    
    return queries


def build_search_q(query, fields):
    """
    Build a Q object for searching across multiple fields with partial matching
    """
    q_objects = Q()
    search_queries = create_search_queries(query)
    
    for field in fields:
        for search_term in search_queries:
            q_objects |= Q(**{f"{field}__icontains": search_term})
    
    return q_objects


def search_view(request):
    query = request.GET.get('search', '').strip()
    results = []
    total_results = 0
    
    if query and len(query) >= 2:  # Minimum 2 characters for search
        
        # Search Products
        product_fields = ['title', 'description', 'product_id', 'features_benefits', 
                         'application', 'recommendation']
        
        products = Product.objects.filter(
            build_search_q(query, product_fields),
            is_active=True
        ).distinct()
        
        for product in products:
            results.append({
                'title': product.title,
                'description': product.description[:200] + '...' if product.description and len(product.description) > 200 else product.description or '',
                'url': f'/product/{product.slug}/',
                'type': 'Product',
                'image': product.image.url if product.image else None
            })
        
        # Search Product Ranges
        range_fields = ['name', 'description']
        
        product_ranges = ProductRange.objects.filter(
            build_search_q(query, range_fields),
            is_active=True
        ).distinct()
        
        for range_obj in product_ranges:
            results.append({
                'title': range_obj.name,
                'description': range_obj.description[:200] + '...' if range_obj.description and len(range_obj.description) > 200 else range_obj.description or '',
                'url': f'/products/',
                'type': 'Product Range',
                'image': range_obj.image.url if range_obj.image else None
            })
        
        # Search Application Areas
        application_fields = ['name']
        
        applications = ApplicationArea.objects.filter(
            build_search_q(query, application_fields),
            is_active=True
        ).distinct()
        
        for app in applications:
            results.append({
                'title': app.name or f"Application Area {app.id}",
                'description': f'Application Area: {app.name or "Unnamed"}',
                'url': f'/products/',
                'type': 'Application Area',
                'image': app.icon.url if app.icon else None
            })
        
        # Search Specifications
        spec_fields = ['name']
        
        specifications = Specification.objects.filter(
            build_search_q(query, spec_fields),
            is_active=True
        ).distinct()
        
        for spec in specifications:
            results.append({
                'title': spec.name,
                'description': f'Specification: {spec.name}',
                'url': f'/products/',
                'type': 'Specification',
                'image': None
            })
        
        # Search Viscosities
        viscosity_fields = ['name']
        
        viscosities = Viscosity.objects.filter(
            build_search_q(query, viscosity_fields),
            is_active=True
        ).distinct()
        
        for viscosity in viscosities:
            results.append({
                'title': viscosity.name,
                'description': f'Viscosity: {viscosity.name}',
                'url': f'/products/',
                'type': 'Viscosity',
                'image': None
            })
        
        # Search Compositions
        composition_fields = ['name']
        
        compositions = Composition.objects.filter(
            build_search_q(query, composition_fields),
            is_active=True
        ).distinct()
        
        for composition in compositions:
            results.append({
                'title': composition.name,
                'description': f'Composition: {composition.name}',
                'url': f'/products/',
                'type': 'Composition',
                'image': None
            })
        
        # Search Typical Properties
        property_fields = ['property', 'unit', 'test_method', 'typical_value']
        
        properties = TypicalProperties.objects.filter(
            build_search_q(query, property_fields)
        ).select_related('product').distinct()
        
        for prop in properties:
            results.append({
                'title': f'{prop.product.title} - {prop.property}',
                'description': f'Property: {prop.property}, Value: {prop.typical_value}, Test Method: {prop.test_method}',
                'url': f'/products/',
                'type': 'Product Property',
                'image': None
            })
        
        # Search Product Reviews
        review_fields = ['first_name', 'surname', 'summary', 'review']
        
        reviews = Review.objects.filter(
            build_search_q(query, review_fields),
            is_approved=True
        ).select_related('product').distinct()
        
        for review in reviews:
            results.append({
                'title': f'Review by {review.full_name}',
                'description': review.summary[:200] + '...' if review.summary and len(review.summary) > 200 else review.summary or '',
                'url': f'/product/{product.slug}/',
                'type': 'Product Review',
                'image': None
            })
        
        # Search Case Studies
        case_study_fields = ['title', 'header_text', 'description']
        
        case_studies = CaseStudy.objects.filter(
            build_search_q(query, case_study_fields)
        ).distinct()
        
        for case_study in case_studies:
            results.append({
                'title': case_study.title,
                'description': case_study.description[:200] + '...' if case_study.description and len(case_study.description) > 200 else case_study.description or '',
                'url': f'/case-study/{case_study.id}/',
                'type': 'Case Study',
                'image': case_study.image_one.url if case_study.image_one else None
            })
        
        # Search News
        news_fields = ['title', 'header_text', 'description']
        
        news_items = News.objects.filter(
            build_search_q(query, news_fields)
        ).distinct()
        
        for news in news_items:
            results.append({
                'title': news.title,
                'description': news.description[:200] + '...' if news.description and len(news.description) > 200 else news.description or '',
                'url': f'/news/{news.id}/',
                'type': 'News',
                'image': news.image_one.url if news.image_one else None
            })
        
        # Search Brand Promotional Items
        brand_promo_fields = ['title']
        
        brand_promos = BrandPromotionalItem.objects.filter(
            build_search_q(query, brand_promo_fields)
        ).distinct()
        
        for promo in brand_promos:
            results.append({
                'title': promo.title,
                'description': f'Brand Promotional Item: {promo.title}',
                'url': '/brand/?tab=promotional',
                'type': 'Brand Promotional',
                'image': promo.preview_image.url if promo.preview_image else None
            })
        
        # Search Brand Image Library
        brand_image_fields = ['title']
        
        brand_images = BrandImageLibrary.objects.filter(
            build_search_q(query, brand_image_fields)
        ).distinct()
        
        for image in brand_images:
            results.append({
                'title': image.title,
                'description': f'Brand Image ({image.get_type_display()}): {image.title}',
                'url': '/brand/?tab=image-library',
                'type': 'Brand Image',
                'image': image.preview_image.url if image.preview_image else None
            })
        
        # Search Brand Videos
        brand_video_fields = ['title']
        
        brand_videos = BrandVideo.objects.filter(
            build_search_q(query, brand_video_fields)
        ).distinct()
        
        for video in brand_videos:
            results.append({
                'title': video.title,
                'description': f'Brand Video: {video.title}',
                'url': '/brand/?tab=videos',
                'type': 'Brand Video',
                'image': video.thumbnail.url if video.thumbnail else None
            })
        
        # Search Brand Guidelines
        brand_guide_fields = ['title']
        
        brand_guides = BrandGuidelineDocument.objects.filter(
            build_search_q(query, brand_guide_fields)
        ).distinct()
        
        for guide in brand_guides:
            results.append({
                'title': guide.title,
                'description': f'Brand Guideline: {guide.title}',
                'url': '/brand/?tab=brand-guideline',
                'type': 'Brand Guidelines',
                'image': None
            })
        
        # Search Brand Catalogues
        catalogue_fields = ['title', 'description']
        
        catalogues = BrandCatalogue.objects.filter(
            build_search_q(query, catalogue_fields)
        ).distinct()
        
        for catalogue in catalogues:
            results.append({
                'title': catalogue.title,
                'description': catalogue.description[:200] + '...' if catalogue.description and len(catalogue.description) > 200 else catalogue.description or '',
                'url': '/brand/?tab=catalogue',
                'type': 'Brand Catalogue',
                'image': catalogue.preview_image.url if catalogue.preview_image else None
            })
        
        # Search Home Swiper
        swiper_fields = ['title', 'description', 'title_description']
        
        swipers = HomeSwiper.objects.filter(
            build_search_q(query, swiper_fields),
            is_active=True
        ).distinct()
        
        for swiper in swipers:
            results.append({
                'title': swiper.title,
                'description': swiper.description[:200] + '...' if swiper.description and len(swiper.description) > 200 else swiper.description or '',
                'url': swiper.link or '/',
                'type': 'Home Banner',
                'image': swiper.image.url if swiper.image else None
            })
        
        # Search Tomoil Reviews
        tomoil_review_fields = ['name', 'position', 'review']
        
        tomoil_reviews = TomoilReview.objects.filter(
            build_search_q(query, tomoil_review_fields),
            is_active=True
        ).distinct()
        
        for review in tomoil_reviews:
            results.append({
                'title': f'Review by {review.name}',
                'description': review.review[:200] + '...' if review.review and len(review.review) > 200 else review.review or '',
                'url': '/',
                'type': 'Customer Review',
                'image': review.image.url if review.image else None
            })
        
        # Search Questions
        question_fields = ['question', 'answer']
        
        questions = Question.objects.filter(
            build_search_q(query, question_fields)
        ).distinct()
        
        for question in questions:
            results.append({
                'title': question.question[:100] + '...' if len(question.question) > 100 else question.question,
                'description': question.answer[:200] + '...' if question.answer and len(question.answer) > 200 else question.answer or 'No answer provided yet',
                'url': '/faq/',
                'type': 'FAQ',
                'image': None
            })
        
        # Search LubelQ
        lubelq_fields = ['title', 'description', 'description_header_text']
        
        lubelq_items = LubelQ.objects.filter(
            build_search_q(query, lubelq_fields)
        ).distinct()
        
        for item in lubelq_items:
            results.append({
                'title': item.title,
                'description': item.description[:200] + '...' if item.description and len(item.description) > 200 else item.description or '',
                'url': '/services/',
                'type': 'Services',
                'image': None
            })
        
        # Search Services
        service_fields = ['tab_title', 'title', 'description']
        
        services = Services.objects.filter(
            build_search_q(query, service_fields)
        ).distinct()
        
        for service in services:
            results.append({
                'title': service.title,
                'description': service.description[:200] + '...' if service.description and len(service.description) > 200 else service.description or '',
                'url': '/services/',
                'type': 'Services',
                'image': None
            })
        
        # Search Glance
        glance_fields = ['title', 'header_text', 'description', 'description_header_text']
        
        glances = Glance.objects.filter(
            build_search_q(query, glance_fields)
        ).distinct()
        
        for glance in glances:
            results.append({
                'title': glance.title,
                'description': glance.description[:200] + '...' if glance.description and len(glance.description) > 200 else glance.description or '',
                'url': '/glance/',
                'type': 'Glance',
                'image': glance.image.url if glance.image else None
            })
        
        # Search Glance Guides
        guide_fields = ['guide', 'guide_text']
        
        guides = GlanceGuide.objects.filter(
            build_search_q(query, guide_fields)
        ).select_related('glance').distinct()
        
        for guide in guides:
            results.append({
                'title': guide.guide,
                'description': guide.guide_text[:200] + '...' if guide.guide_text and len(guide.guide_text) > 200 else guide.guide_text or '',
                'url': '/glance/',
                'type': 'Glance',
                'image': None
            })
        
        # Search Vision Mission
        vision_mission_fields = ['vision', 'mission']
        
        vision_missions = VisionMission.objects.filter(
            build_search_q(query, vision_mission_fields)
        ).distinct()
        
        for vm in vision_missions:
            results.append({
                'title': 'Vision & Mission',
                'description': vm.vision[:200] + '...' if vm.vision and len(vm.vision) > 200 else vm.vision or '',
                'url': '/vision_mission/',
                'type': 'Vision & Mission',
                'image': None
            })
        
        # Search Values
        value_fields = ['title', 'description']
        
        values = Value.objects.filter(
            build_search_q(query, value_fields)
        ).distinct()
        
        for value in values:
            results.append({
                'title': value.title,
                'description': value.description[:200] + '...' if value.description and len(value.description) > 200 else value.description or '',
                'url': '/vision_mission/',
                'type': 'Values',
                'image': None
            })
        
        # Search Our Commitment
        commitment_fields = ['tab_title', 'title', 'header_description', 'description_title', 'description']
        
        commitments = OurCommitment.objects.filter(
            build_search_q(query, commitment_fields)
        ).distinct()
        
        for commitment in commitments:
            results.append({
                'title': commitment.title,
                'description': commitment.description[:200] + '...' if commitment.description and len(commitment.description) > 200 else commitment.description or '',
                'url': '/our_commitment/',
                'type': 'Our Commitments',
                'image': commitment.image.url if commitment.image else None
            })
        
        # Remove duplicates based on title and type
        seen = set()
        unique_results = []
        for result in results:
            identifier = (result['title'], result['type'])
            if identifier not in seen:
                seen.add(identifier)
                unique_results.append(result)
        
        results = unique_results
        total_results = len(results)
        
        # Sort results by relevance (exact matches first, then partial matches)
        def calculate_relevance(result):
            title_lower = result['title'].lower()
            desc_lower = result['description'].lower()
            query_lower = query.lower()
            
            # Exact match in title gets highest score
            if query_lower in title_lower:
                return 100
            # Exact match in description gets high score
            elif query_lower in desc_lower:
                return 80
            # Partial word matches get medium score
            else:
                score = 0
                for word in query_lower.split():
                    if word in title_lower:
                        score += 20
                    elif word in desc_lower:
                        score += 10
                return score
        
        results.sort(key=calculate_relevance, reverse=True)
        
        # Pagination
        paginator = Paginator(results, 10)  # Show 10 results per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
    else:
        page_obj = None

    try:
        page_header = PageHeader.objects.get(page_key='search_view')
        header_context = {
            'breadcrumb_title': page_header.breadcrumb_title,
            'breadcrumb_url': page_header.breadcrumb_url,
            'page_title': page_header.page_title,
            'page_description': page_header.page_description,
            'background_image': page_header.background_image
        }
    except PageHeader.DoesNotExist:
        header_context = {
            'breadcrumb_title': 'Search',
            'breadcrumb_url': '/search/',
            'page_title': 'Search',
            'page_description': '',
            'background_image': None
        }
    
    context = {
        'query': query,
        'results': page_obj,
        'total_results': total_results,
        **header_context
    }
    
    return render(request, 'search.html', context)

