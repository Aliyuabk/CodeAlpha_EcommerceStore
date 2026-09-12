from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from cart.views import _get_cart
from .models import Order, OrderItem

@login_required
def checkout(request):
    """Render checkout form and process order creation from cart."""
    cart = _get_cart(request)
    cart_items = cart.items.select_related('product').all()

    if not cart_items:
        return redirect('cart:cart_detail')

    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        city = request.POST.get('city')
        postal_code = request.POST.get('postal_code')

        # Create Order instance
        order = Order.objects.create(
            user=request.user,
            full_name=full_name,
            email=email,
            phone=phone,
            address=address,
            city=city,
            postal_code=postal_code,
            total_amount = cart.total_price,
            is_paid=True  # Simulated successful payment
        )

        # Convert CartItems into OrderItems
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity
            )

        # Clear cart items after successful order
        cart_items.delete()

        return redirect('orders:order_detail', order_id=order.id)

    return render(request, 'orders/checkout.html', {
        'cart': cart,
        'cart_items': cart_items,
        'total_price': cart.total_price
    })

@login_required
def order_list(request):
    """List all orders for the logged-in user."""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    return render(request, 'orders/order_list.html', {'orders': orders})

@login_required
def order_detail(request, order_id):
    """Display detailed summary of a specific order."""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'orders/order_detail.html', {'order': order})