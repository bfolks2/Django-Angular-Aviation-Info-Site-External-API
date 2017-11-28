from django.views.generic import TemplateView
from django.shortcuts import render, get_object_or_404

from airports.models import Airport

def index(request):
    # airports = Airport.objects.all().order_by('abbrev')
    return render(request, 'index.html', {})
