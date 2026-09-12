from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from orders.models import Order
from wishlist.models import Wishlist
from history.models import ProductHistory
from .forms import CustomUserCreationForm

def register_view(request):
    """Handle new user registration with full user details."""
    if request.user.is_authenticated:
        return redirect('accounts:profile')
        
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful!")
            return redirect('accounts:profile')
    else:
        form = CustomUserCreationForm()
    return render(request, 'accounts/register.html', {'form': form})

def login_view(request):
    """Handle user login authentication."""
    if request.user.is_authenticated:
        return redirect('accounts:profile')

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            messages.success(request, f"Welcome back, {user.username}!")
            return redirect('accounts:profile')
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    """Log out current user."""
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect('accounts:login')

@login_required
def profile_view(request):
    """Display profile dashboard with profile details, orders, wishlist, and viewing history."""
    profile = request.user.profile

    if request.method == 'POST':
        # Update User fields
        request.user.username = request.POST.get('username', request.user.username)
        request.user.email = request.POST.get('email', request.user.email)
        request.user.save()

        # Update Profile fields
        profile.phone_number = request.POST.get('phone_number', profile.phone_number)
        profile.address = request.POST.get('address', profile.address)
        profile.city = request.POST.get('city', profile.city)
        profile.postal_code = request.POST.get('postal_code', profile.postal_code)

        if 'avatar' in request.FILES:
            profile.avatar = request.FILES['avatar']

        profile.save()
        messages.success(request, "Your profile has been updated successfully!")
        return redirect('accounts:profile')

    # Fetch dynamic user metrics and lists
    recent_orders = Order.objects.filter(user=request.user).order_by('-created_at')[:5]
    wishlist_items = Wishlist.objects.filter(user=request.user).select_related('product')[:6]
    recently_viewed = ProductHistory.objects.filter(user=request.user).select_related('product')[:6]

    context = {
        'user': request.user,
        'profile': profile,
        'recent_orders': recent_orders,
        'wishlist_items': wishlist_items,
        'recently_viewed': recently_viewed,
    }
    return render(request, 'accounts/profile.html', context)