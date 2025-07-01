from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from django.utils import timezone

from products.models import Product
from news.models import News
from caseStudies.models import CaseStudy



class StaticViewSitemap(Sitemap):
    priority = 0.8
    changefreq = 'monthly'
    
    def items(self):
        return [
            'contact:home',
            'contact:contact',
            'contact:validate_phone',
            'contact:footer_email_submit',
            'brand_portal:brand_portal',
            'news:news_list',
            'news:news_api',
            'products:pds_sds',
            'products:all_data_sheets',
            'case_studies:case_studies',
            'services:services_list', 
            'whoweare:glance', 
            'whoweare:vision_mission', 
            'whoweare:our_commitment_list', 
            'faq:faq',
            'search:search',

        ]
    
    def location(self, item):
        return reverse(item)


class ProductSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.9
    
    def items(self):
        return Product.objects.all()
    
    def lastmod(self, obj):
        return obj.created_at
    
    def location(self, obj):
        return reverse('products:products_detail_view', kwargs={'product_slug': obj.slug})



class NewsSitemap(Sitemap):
    changefreq = 'daily'
    priority = 0.7
    
    def items(self):
        return News.objects.all()
    
    def lastmod(self, obj):
        return obj.created_at
    
    def location(self, obj):
       return reverse('news:news_detail', kwargs={'slug': obj.slug})




class CaseStudySitemap(Sitemap):
    changefreq = 'monthly'
    priority = 0.6

    def items(self):
        return CaseStudy.objects.all()

    def location(self, obj):
        return reverse('case_studies:case_study_detail', kwargs={'slug': obj.slug})



class BrandPortalSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.7
    
    def items(self):
        urls = ['brand_portal:brand_portal']
        
        tabs = ['brand-guideline', 'catalogue', 'promotional', 'image-library', 'videos']
        for tab in tabs:
            urls.append(('tab', tab))
            
        return urls
    
    def location(self, item):
        if isinstance(item, tuple) and item[0] == 'tab':
            return reverse('brand_portal:brand_portal') + f'?tab={item[1]}'
        return reverse(item)



sitemaps = {
    'static': StaticViewSitemap(),
    'products': ProductSitemap(),
    'news': NewsSitemap(),
    'case_studies': CaseStudySitemap(),
    'brand_portal': BrandPortalSitemap(),
}