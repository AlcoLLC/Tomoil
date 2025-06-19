from django.urls import path
from .views import index, home_view, validate_phone_api, footer_email_submit

app_name = 'contact'

urlpatterns = [
    path('contact/', index, name='contact'),
    path('validate-phone/', validate_phone_api, name='validate_phone'),
    path("", home_view, name='home'),
    path('footer/submit/', footer_email_submit, name='footer_email_submit'),

]
