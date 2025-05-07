from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.template.loader import render_to_string
from .forms import ContactForm


def index(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)

        if form.is_valid():
            full_name = form.cleaned_data['full_name']
            email = form.cleaned_data['email']
            contact_number = form.cleaned_data['contact_number']
            country = form.cleaned_data['country']
            enquiry_type = form.cleaned_data['enquiry_type']
            preferred_contact_method = form.cleaned_data['preferred_contact_method']
            message = form.cleaned_data['message']

            email_subject = f"New Contact Form Submission: {enquiry_type}"
            email_message = f"""
Name: {full_name}
Email: {email}
Phone: {contact_number}
Country: {country}
Preferred Contact: {preferred_contact_method}
Message: {message}
"""
            html = render_to_string('emails/contactform.html', {
                'full_name': full_name,
                'email': email,
                'contact_number': contact_number,
                'country': country,
                'enquiry_type': enquiry_type,
                'preferred_contact_method': preferred_contact_method,
                'message': message
            })

            form.save()

            send_mail(
                email_subject,
                email_message, 'settings.EMAIL_HOST_USER' 'This is the message', [
                    email],
                html_message=html,
                fail_silently=False,
            )

            return redirect('faq.html')
    else:
        form = ContactForm()

    return render(request, 'contact.html', {'form': form})


def home_view(request):
    return render(request, 'home.html')
