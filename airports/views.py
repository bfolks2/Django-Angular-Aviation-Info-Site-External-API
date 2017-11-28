from django.shortcuts import render
from airports.models import Airport
from airports.serializers import AirportSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class AirportAPIView(APIView):
    def get(self,request):
        airports = Airport.objects.all().order_by('name')
        serializer = AirportSerializer(airports, many=True)
        return Response(serializer.data)
