from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.http import JsonResponse
from .models import Contact, HomeSwiper, CarLogo, PartnerLogo, TomoilReview
from products.models import ProductRange
from .forms import ContactForm
import requests
import re
import phonenumbers
from products.models import Product, ApplicationArea
from news.models import News
from caseStudies.models import CaseStudy


def validate_phone_number(phone_number, country_code):
    try:
        country_code = re.sub(r'\D', '', country_code)

        if not str(country_code).startswith('+'):
            country_code = '+' + str(country_code)

        phone_number = ''.join(filter(str.isdigit, phone_number))

        parsed_number = phonenumbers.parse(
            f"{country_code}{phone_number}", None)

        return phonenumbers.is_valid_number(parsed_number)
    except Exception:
        return False

def get_country_name_by_code(country_code):
    try:
        code = country_code.replace('+', '')

        response = requests.get(
            f'https://restcountries.com/v3.1/callingcode/{code}')
        data = response.json()

        if response.status_code == 200 and data:
            return data[0]['name']['common']
        return None
    except Exception:
        return None

def validate_phone_api(request):
    if request.method == 'POST':
        country_code = request.POST.get('country_code', '')
        phone_number = request.POST.get('phone_number', '')

        is_valid = validate_phone_number(phone_number, country_code)
        country_name = get_country_name_by_code(
            country_code) if is_valid else None

        return JsonResponse({
            'valid': is_valid,
            'country_name': country_name
        })

    return JsonResponse({'valid': False})

def index(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)

        if form.is_valid():
            try:
                contact = form.save()

                first_name = form.cleaned_data['first_name']
                last_name = form.cleaned_data['last_name']
                country_code = form.cleaned_data['country_code']
                contact_number = form.cleaned_data['contact_number']
                email = form.cleaned_data['email']
                country = form.cleaned_data['country']
                enquiry_type = form.cleaned_data['enquiry_type']
                preferred_contact_method = form.cleaned_data['preferred_contact_method']
                message = form.cleaned_data['message']

                email_subject = f"New Contact Form Submission from {first_name} {last_name}"

                email_message = f"""
Name: {first_name} {last_name}
Email: {email}
Phone: {country_code} {contact_number}
Country: {country}
Enquiry Type: {enquiry_type}
Preferred Contact: {preferred_contact_method}
Message: {message}
"""

                html_email = render_to_string('emails/contactform.html', {
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': email,
                    'contact_number': f"{country_code} {contact_number}",
                    'country': country,
                    'enquiry_type': enquiry_type,
                    'preferred_contact_method': preferred_contact_method,
                    'message': message
                })

                from django.conf import settings
                from django.core.mail import send_mail

                send_mail(
                    email_subject,
                    email_message,
                    settings.EMAIL_HOST_USER,
                    ['aytacmehdizade08@gmail.com'],
                    html_message=html_email,
                    fail_silently=False,
                )

                user_email_subject = "Thank you for contacting Tomoil"
                user_email_message = f"""
Dear {first_name},

Thank you for contacting Tomoil. We have received your {enquiry_type} request.
Our team will get back to you shortly via your preferred contact method: {preferred_contact_method}.

Best regards,
Tomoil Support Team
"""
                send_mail(
                    user_email_subject,
                    user_email_message,
                    settings.EMAIL_HOST_USER,
                    [email],
                    fail_silently=False,
                )
                return redirect('/')

            except Exception as e:
                print(f"Error processing form: {e}")
                form.add_error(None, "An error occurred. Please try again.")

        context = get_countries_and_codes(form)
        return render(request, 'contact.html', context)

    else:
        form = ContactForm()

    context = get_countries_and_codes(form)
    return render(request, 'contact.html', context)

def get_countries_and_codes(form):
    try:
        countries_response = requests.get(
            'https://restcountries.com/v3.1/all?fields=name,flags,cca2,idd')
        countries_data = countries_response.json()

        countries = []
        country_codes = []

        for country in countries_data:
            countries.append({
                'name': country['name']['common'],
                'flag': country['flags'].get('png', ''),
                'code': country['cca2'].lower()
            })

            if 'idd' in country and 'root' in country['idd'] and 'suffixes' in country['idd']:
                for suffix in country['idd']['suffixes']:
                    country_codes.append({
                        'name': country['name']['common'],
                        'code': f"{country['idd']['root']}{suffix}",
                        'short': country['idd']['root']
                    })

        countries = sorted(countries, key=lambda x: x['name'])
        country_codes = sorted(country_codes, key=lambda x: x['name'])

    except Exception as e:
        print(f"Error fetching countries: {e}")
        countries = [
            {'name': 'Azerbaijan', 'flag': '/static/images/flags/az.png', 'code': 'az'},
            {'name': 'Turkey', 'flag': '/static/images/flags/tr.png', 'code': 'tr'},
            {'name': 'USA', 'flag': '/static/images/flags/us.png', 'code': 'us'},
        ]

        country_codes = [
            {'name': 'Azerbaijan', 'code': '+994', 'short': '+994'},
            {'name': 'Turkey', 'code': '+90', 'short': '+90'},
            {'name': 'USA', 'code': '+1', 'short': '+1'},
        ]

    return {
        'form': form,
        'countries': countries,
        'country_codes': country_codes,
        'enquiry_types': Contact.ENQUIRY_TYPES,
        'contact_methods': Contact.CONTACT_METHODS
    }

def home_view(request):
    swiper_images = HomeSwiper.objects.filter(is_active=True).order_by('order')
    products = Product.objects.filter(is_home=True).order_by('order')
    application_areas = ApplicationArea.objects.filter(is_home=True).order_by('order')
    home_news = News.objects.filter(in_home=True).order_by('-created_at')
    home_news_list = list(home_news[:3])
    large_card_news = home_news_list[0] if home_news_list else None
    small_cards_news = home_news_list[1:3] if len(home_news_list) > 1 else []
    case_studies = CaseStudy.objects.filter(is_home=True).order_by('order')
    car_logos = CarLogo.objects.filter(is_active=True).order_by('order')
    partner_logos = PartnerLogo.objects.filter(is_active=True).order_by('order')
    reviews = TomoilReview.objects.filter(is_active=True).order_by('-created_at')
    product_ranges = ProductRange.objects.filter(is_home=True).order_by('order')

    context = {
        'swiper_images': swiper_images,
        'products': products,
        'application_areas': application_areas,
        'large_card_news': large_card_news,
        'small_cards_news': small_cards_news,
        'case_studies': case_studies,
        'car_logos': car_logos,
        'partner_logos': partner_logos,
        'reviews': reviews,
        'product_ranges': product_ranges,
    }
    return render(request, 'home.html', context) 