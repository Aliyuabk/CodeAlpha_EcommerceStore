from django.urls import path
from . import views

app_name = 'history'

urlpatterns = [
    path('', views.product_history, name='product_history'),
    path('clear/', views.clear_history, name='clear_history'),
    path('remove/<int:item_id>/', views.remove_history_item, name='remove_history_item'),
]