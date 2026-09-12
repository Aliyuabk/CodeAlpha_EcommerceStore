from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from products.models import Product
from cart.models import Cart, CartItem
from cart.views import _get_cart
from .models import Wishlist

@login_required
def wishlist_detail(request):
    """Display user's saved wishlist items."""
    wishlist_items = Wishlist.objects.filter(user=request.user).select_related('product')
    return render(request, 'wishlist/wishlist_detail.html', {'wishlist_items': wishlist_items})

@login_required
@require_POST
def wishlist_add(request, product_id):
    """Toggle or add a product to the user's wishlist."""
    product = get_object_or_404(Product, id=product_id)
    Wishlist.objects.get_or_create(user=request.user, product=product)
    return redirect('wishlist:wishlist_detail')

@login_required
@require_POST
def wishlist_remove(request, item_id):
    """Remove an item from the wishlist."""
    wishlist_item = get_object_or_404(Wishlist, id=item_id, user=request.user)
    wishlist_item.delete()
    return redirect('wishlist:wishlist_detail')

@login_required
@require_POST
def wishlist_move_to_cart(request, item_id):
    """Move an item from the wishlist directly into the shopping cart."""
    wishlist_item = get_object_or_404(Wishlist, id=item_id, user=request.user)
    cart = _get_cart(request)
    
    # Add product to cart or increment quantity
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=wishlist_item.product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()

    # Delete from wishlist after moving
    wishlist_item.delete()
    return redirect('cart:cart_detail')