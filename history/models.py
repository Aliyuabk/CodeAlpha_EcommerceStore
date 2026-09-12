from django.db import models
from django.contrib.auth.models import User
from products.models import Product

class ProductHistory(models.Model):
    user = models.ForeignKey(User, related_name='history', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Product Histories'
        ordering = ['-viewed_at']

    def __str__(self):
        return f"{self.user.username} viewed {self.product.name}"