from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from .models import ProductHistory

@login_required
def product_history(request):
    """Display user's recently viewed products ordered by most recent."""
    history_items = ProductHistory.objects.filter(user=request.user).select_related('product').order_by('-viewed_at')
    return render(request, 'history/product_history.html', {'history_items': history_items})

@login_required
@require_POST
def clear_history(request):
    """Clear all product browsing history for the logged-in user."""
    ProductHistory.objects.filter(user=request.user).delete()
    return redirect('history:product_history')

@login_required
@require_POST
def remove_history_item(request, item_id):
    """Remove a single product entry from history."""
    item = get_object_or_404(ProductHistory, id=item_id, user=request.user)
    item.delete()
    return redirect('history:product_history')