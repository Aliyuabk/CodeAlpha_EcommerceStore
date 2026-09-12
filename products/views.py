from django.shortcuts import render, get_object_or_404
from .models import Product
from history.models import ProductHistory

def product_list(request):
    """Display all active products."""
    products = Product.objects.filter(is_available=True)
    return render(request, 'products/product_list.html', {'products': products})

def product_detail(request, slug):
    """Display product details and track user browsing history."""
    product = get_object_or_404(Product, slug=slug)

    # Automatically track product in user's history if authenticated
    if request.user.is_authenticated:
        history_item, created = ProductHistory.objects.get_or_create(
            user=request.user, 
            product=product
        )
        if not created:
            history_item.save()  # Refresh timestamp on revisit

    return render(request, 'products/product_detail.html', {'product': product})