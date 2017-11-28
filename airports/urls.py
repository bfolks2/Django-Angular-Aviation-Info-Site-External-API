from django.conf.urls import url
from airports import views

app_name='airports'

urlpatterns = [
    url(r'^api/$', views.AirportAPIView.as_view(), name='airport_api'),
]
