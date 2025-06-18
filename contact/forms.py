from django import forms
from django.core.validators import RegexValidator
from .models import Contact, Footer
import phonenumbers


class ContactForm(forms.ModelForm):
    country_code = forms.CharField(max_length=10)

    class Meta:
        model = Contact
        fields = [
            'first_name', 'last_name', 'country_code', 'contact_number',
            'email', 'country', 'enquiry_type', 'preferred_contact_method',
            'message', 'consent'
        ]
        error_messages = {
            'first_name': {
                'required': 'Please enter your first name.',
            },
            'last_name': {
                'required': 'Please enter your last name.',
            },
            'contact_number': {
                'required': 'Please enter your contact number.',
            },
            'email': {
                'required': 'Please enter your email address.',
                'invalid': 'Please enter a valid email address.',
            },
            'country': {
                'required': 'Please select a country.',
            },
            'enquiry_type': {
                'required': 'Please select an enquiry type.',
            },
            'preferred_contact_method': {
                'required': 'Please select a preferred contact method.',
            },
        }

    def clean_contact_number(self):
        country_code = self.cleaned_data.get('country_code', '')
        contact_number = self.cleaned_data.get('contact_number', '')

        contact_number = ''.join(filter(str.isdigit, contact_number))

        if not country_code.startswith('+'):
            country_code = '+' + country_code

        try:
            parsed_number = phonenumbers.parse(
                f"{country_code}{contact_number}", None)

            if not phonenumbers.is_valid_number(parsed_number):
                raise forms.ValidationError(
                    "Please enter a valid phone number.")

            return contact_number
        except Exception:
            raise forms.ValidationError("Please enter a valid phone number.")

    def clean(self):
        cleaned_data = super().clean()

        consent = cleaned_data.get('consent')
        if not consent:
            self.add_error(
                'consent', 'You must provide consent to submit this form.')

        return cleaned_data


class FooterForm(forms.ModelForm):
    class Meta:
        model = Footer
        fields = ['email']
        widgets = {
            'email': forms.EmailInput(attrs={
                'placeholder': 'Enter your email',
                'class': 'footer-email-input'
            })
        }
