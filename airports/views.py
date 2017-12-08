from django.shortcuts import render
from airports.models import Airport
from airports.serializers import AirportSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class AirportAPIView(APIView):

    serializer_class = AirportSerializer

    def get(self,request):
        airports = Airport.objects.all().order_by('name')
        serializer = AirportSerializer(airports, many=True)
        return Response(serializer.data)

    def post(self,request):
        serializer = AirportSerializer(data=request.data)

        if serializer.is_valid():
            name=serializer.data.get('name')
            icao=serializer.data.get('icao')
            airport_dict={'name':name, 'icao':icao}
            airport=Airport(**airport_dict)
            airport.save()
            return Response({'airport_dict':airport_dict})

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self,request, icao=None):

        airport=get_object_or_404(Airport, icao=icao)

        return Response({'method':'put'})

    def patch(self,request, icao=None):

        airport=get_object_or_404(Airport, icao=icao)

        return Response({'method':'patch'})
