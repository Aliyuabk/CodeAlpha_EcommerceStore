from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('cart/', include('cart.urls', namespace='cart')),
    path('orders/', include('orders.urls', namespace='orders')),
    path('wishlist/', include('wishlist.urls', namespace='wishlist')),
    path('history/', include('history.urls', namespace='history')),
    path('accounts/', include('accounts.urls', namespace='accounts')),
    
    # ALWAYS KEEP PRODUCTS LAST so <slug:slug>/ doesn't intercept other app routes
    path('', include('products.urls', namespace='products')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)