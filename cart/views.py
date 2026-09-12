from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from products.models import Product
from .models import Cart, CartItem

def _get_cart(request):
    """Helper to retrieve or create a cart using user session or authenticated user."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        session_id = request.session.session_key
        if not session_id:
            request.session.create()
            session_id = request.session.session_key
        cart, _ = Cart.objects.get_or_create(session_id=session_id)
    return cart

def cart_detail(request):
    """Display cart items and total calculation."""
    cart = _get_cart(request)
    items = cart.items.select_related('product').all()
    total_price = cart.total_price
    
    return render(request, 'cart/cart_detail.html', {
        'cart': cart,
        'items': items,
        'total_price': total_price
    })

@require_POST
def cart_add(request, product_id):
    """Add a product to the cart or increment its quantity."""
    cart = _get_cart(request)
    product = get_object_or_404(Product, id=product_id)
    
    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()
        
    return redirect('cart:cart_detail')

@require_POST
def cart_update(request, item_id):
    """Update quantity of an existing cart item."""
    cart = _get_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    
    action = request.POST.get('action')
    if action == 'increase':
        cart_item.quantity += 1
        cart_item.save()
    elif action == 'decrease':
        cart_item.quantity -= 1
        if cart_item.quantity <= 0:
            cart_item.delete()
        else:
            cart_item.save()
            
    return redirect('cart:cart_detail')

@require_POST
def cart_remove(request, item_id):
    """Remove an item completely from the cart."""
    cart = _get_cart(request)
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    cart_item.delete()
    return redirect('cart:cart_detail')