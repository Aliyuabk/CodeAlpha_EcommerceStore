"""
Django settings for ecommerce_project.

Generated for: CodeAlpha E-Commerce
Environment: Development (XAMPP MySQL + LAN access for mobile testing)
"""

import os
import socket
from pathlib import Path

# ============================================================
# PATHS
# ============================================================
BASE_DIR = Path(__file__).resolve().parent.parent


# ============================================================
# SECURITY
# ============================================================
SECRET_KEY = 'django-insecure-replace-this-with-your-secret-key'

DEBUG = True

# ------------------------------------------------------------
# ALLOWED_HOSTS
#   - localhost / 127.0.0.1 → desktop testing
#   - LAN IP auto-detected  → mobile testing on same Wi-Fi
#   - 0.0.0.0 included      → required when binding runserver
# ------------------------------------------------------------
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
]

# Auto-detect LAN IP so phone on same Wi-Fi can reach dev server
def _detect_lan_ip():
    """Return the LAN-facing IPv4 of this machine, or None."""
    try:
        # Preferred: opens a UDP socket to a public IP (no packets actually sent)
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        try:
            # Fallback: resolve hostname
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return None

LAN_IP = _detect_lan_ip()
if LAN_IP and LAN_IP not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(LAN_IP)


# ------------------------------------------------------------
# CSRF_TRUSTED_ORIGINS
#   Required for POST requests (login, register, cart, etc.)
#   from the phone — without it you get 403 Forbidden.
# ------------------------------------------------------------
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]

if LAN_IP:
    CSRF_TRUSTED_ORIGINS.append(f'http://{LAN_IP}:8000')

# Also trust any explicitly listed host
for _host in ALLOWED_HOSTS:
    if _host not in ('localhost', '127.0.0.1', '0.0.0.0'):
        _origin = f'http://{_host}:8000'
        if _origin not in CSRF_TRUSTED_ORIGINS:
            CSRF_TRUSTED_ORIGINS.append(_origin)


# ============================================================
# APPLICATIONS
# ============================================================
INSTALLED_APPS = [
    # Django built-ins
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Custom e-commerce apps
    'accounts',
    'products',
    'cart',
    'orders',
    'history',
    'wishlist',
]


# ============================================================
# MIDDLEWARE
# ============================================================
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ============================================================
# URLS & TEMPLATES
# ============================================================
ROOT_URLCONF = 'ecommerce_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
                'cart.context_processors.cart',  # Cart item count badge
            ],
        },
    },
]

WSGI_APPLICATION = 'ecommerce_project.wsgi.application'


# ============================================================
# DATABASE — XAMPP MySQL
#   Note: HOST stays 127.0.0.1 because Django connects to
#   MySQL locally. Only the HTTP port needs to be reachable
#   from your phone.
# ============================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'codealpha_db',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}


# ============================================================
# PASSWORD VALIDATION
# ============================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# ============================================================
# INTERNATIONALIZATION
# ============================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# ============================================================
# STATIC & MEDIA FILES
# ============================================================
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# ============================================================
# DEFAULTS
# ============================================================
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ============================================================
# AUTHENTICATION REDIRECTIONS
# ============================================================
LOGIN_URL = 'accounts:login'
LOGIN_REDIRECT_URL = 'products:product_list'
LOGOUT_REDIRECT_URL = 'accounts:login'


# ============================================================
# DEV SERVER HELPER
#   Prints the LAN URL at startup so you can copy it to your
#   phone without running `ipconfig` / `ifconfig`.
# ============================================================
if DEBUG and LAN_IP:
    import sys
    # Only print when running `runserver` (not during migrations, etc.)
    if 'runserver' in sys.argv:
        print()
        print('  📱 Access from your phone (same Wi-Fi):')
        print(f'     http://{LAN_IP}:8000')
        print()