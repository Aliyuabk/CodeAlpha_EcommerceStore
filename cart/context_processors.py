def cart(request):
    cart_session = request.session.get('cart', {})
    # Calculates total items count if stored as dict like {'product_id': quantity}
    total_items = sum(cart_session.values()) if isinstance(cart_session, dict) else 0
    return {'cart_count': total_items}