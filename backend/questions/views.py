from django.shortcuts import render
from .models import Question

def faq_view(request):
    questions = Question.objects.all().order_by('-created_at') 
    return render(request, 'faq.html', {'questions': questions})
