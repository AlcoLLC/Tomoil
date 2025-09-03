from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from django.http import HttpResponse
from django.contrib.sitemaps.views import sitemap
from core.sitemaps import sitemaps
from django.shortcuts import redirect



def robots_txt(request):
    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        "Disallow: /api/",
        "Disallow: /media/private/",
        "Disallow: /i18n/setlang/",
        "",
        "Sitemap: https://tomoil.de/sitemap.xml"
        
    ]
    return HttpResponse('\n'.join(lines), content_type="text/plain")


urlpatterns = [
    path('admin/', admin.site.urls),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('i18n/', include('django.conf.urls.i18n')),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('robots.txt', robots_txt),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}),

]

urlpatterns += i18n_patterns(
    path('', include("caseStudies.urls")),
    path('', include("questions.urls")),
    path('', include("contact.urls")),
    path('', include("news.urls")),
    path('', include("brands.urls")),
    path('', include("services.urls")),
    path('', include("whoweare.urls")),
    path('', include("products.urls")),
    path('', include("search.urls")),

    prefix_default_language=False
)

urlpatterns += [
    re_path(r'^rosetta/', include('rosetta.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
else:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'contact.views.custom_404_view'
handler500 = 'contact.views.custom_500_view'
handler403 = 'contact.views.custom_403_view'
handler503 = 'contact.views.custom_503_view'


# Error URLs redirects
error_urls = {
    'pds_sds/': 'pds-sds/',
    'our_commitment/': 'our-commitment/',
    'vision_mission/': 'vision-mission/',
    'fr/news/0/': 'fr/news/',
    'services/marketing/': 'services/',
    'products/motor-oil-for-truck-and-buses/': '',
    'de/news/0/': 'de/news/',
    'zh-hans/news/0/': 'zh-hans/news/',
    'es/news/0/': 'es/news/',
    'services/industry/': 'services/',
    'news/0/': 'news/',
    'products/adblue/': 'products/',
    'products/gear-oils-and-transmission-fluids/': 'products/',
    'products/antifreeze-and-coolants/': 'products/',
    'products/break-fluid/': 'products/',
    'services/fleet/': 'services/',
    'company/vision-mission/': 'vision-mission/',
    'products/industrial-oils/': '?product_range=industrial-gear-oil',
    'company/culture/': '',
    'cdn-cgi/l/email-protection/': '',
    'static/tomoil-motoroil.pdf/': '',
}

for old_slug, new_slug in error_urls.items():
    urlpatterns += [
        path(f'{old_slug}', lambda request, new_slug=new_slug: redirect(f'/{new_slug}', permanent=True))
    ]

# Product URLs redirects
product_urls = [
    'products/motor-oil-for-cars/',
    'products/motor-oil-for-bikes-and-scooters/',
    'products/product/tomoil-engine-oil-5w-20-spgf-6a/',
    'products/product/tomoil-engine-oil-5w-30-spgf-6a/',
    'products/product/tomoil-engine-oil-5w-40-sp/',
    'products/product/tomoil-engine-oil-10w-30-spgf-6a/',
    'products/product/tomoil-engine-oil-0w-30-sp/',
    'products/product/tomoil-engine-oil-0w-30-spgf-6a/',
    'products/product/tomoil-engine-oil-0w-16-spgf-6b/',
    'products/product/tomoil-engine-oil-0w-20-c5c6/',
    'products/product/tomoil-engine-oil-0w-8-glv-1/',
    'products/product/tomoil-engine-oil-0w-20-spgf-6a/',
    'products/product/tomoil-engine-oil-0w-20-c5/',
    'products/product/tomoil-engine-oil-5w-30-sp/',
]

for url in product_urls:
    urlpatterns += [
        path(f'{url}', lambda request, url=url: redirect('/products/?product_range=engine-oils/', permanent=True))
    ]

# DE Product URLs redirects
de_product_urls = [
    'de/products/de/product/tomoil-engine-oil-0w-30-sp/',
    'de/products/de/product/tomoil-engine-oil-0w-8-glv-1/',
    'de/products/de/product/tomoil-engine-oil-5w-20-spgf-6a/',
    'de/products/de/product/tomoil-engine-oil-0w-20-c5/',
    'de/products/de/product/tomoil-engine-oil-5w-30-spgf-6a/',
    'de/products/de/product/tomoil-engine-oil-10w-30-spgf-6a/',
    'de/products/de/product/tomoil-engine-oil-0w-30-spgf-6a/',
    'de/products/de/product/tomoil-engine-oil-5w-30-sp/',
    'de/products/de/product/tomoil-engine-oil-0w-20-c5c6/',
    'de/products/de/product/tomoil-engine-oil-5w-40-sp/',
    'de/products/de/product/tomoil-engine-oil-0w-20-spgf-6a/',
    'de/products/de/product/tomoil-engine-oil-0w-16-spgf-6b/',
]

for url in de_product_urls:
    urlpatterns += [
        path(f'{url}', lambda request, url=url: redirect('/de/products/?product_range=engine-oils/', permanent=True))
    ]
