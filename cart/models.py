from django.db import models
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from products.models import Product

class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    session_id = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

    def __str__(self):
        try:
            user_str = str(self.user) if self.user else self.session_id
        except ObjectDoesNotExist:
            user_str = f"Deleted User (Session: {self.session_id})"
        return f"Cart ({user_str})"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_total_price(self):
        return self.product.price * self.quantity

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"