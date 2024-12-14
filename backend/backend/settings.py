from pathlib import Path
from decouple import config
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DJANGO_DEBUG', default=False, cast=bool)

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'django_axor_auth',

    'items',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # Apply on request
    # # required
    "django_axor_auth.middlewares.HeaderRequestedByMiddleware",
    "django_axor_auth.users.middlewares.ActiveUserMiddleware",
    # # optional
    "django_axor_auth.extras.middlewares.VerifyRequestOriginMiddleware",
    "django_axor_auth.extras.middlewares.ValidateJsonMiddleware",

    # Apply on response
    "django_axor_auth.logs.middlewares.APILogMiddleware",
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / '.venv/lib/python3.12/site-packages/django_axor_auth/web_auth/templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

AXOR_AUTH = dict(
    # General
    APP_NAME = "your_app_name",
    FRONTEND_URL = "http://localhost:3000",
    URI_PREFIX = "/api", # URI prefix for all API endpoints

    # Cookies
    AUTH_COOKIE_NAME = 'axor_auth',
    AUTH_COOKIE_AGE = 60 * 60 * 24 * 7,  # 1 week
    AUTH_COOKIE_SECURE = True,
    AUTH_COOKIE_SAMESITE = 'Strict',
    AUTH_COOKIE_DOMAIN = 'localhost',

    # Forgot password
    FORGET_PASSWORD_LINK_TIMEOUT = 30, # in minutes
    FORGET_PASSWORD_LOCKOUT_TIME = 24, # in hours

    # TOTP
    TOTP_NUM_OF_BACKUP_CODES = 8,
    TOTP_BACKUP_CODE_LENGTH = 8,

    # Email
    SMTP_USE_TLS = True,
    SMTP_USE_SSL = False,
    SMTP_HOST = "smtp.office365.com",
    SMTP_PORT = 587,
    SMTP_USER = "your_email",
    SMTP_PASSWORD = "your_password",
    SMTP_DEFAULT_SEND_FROM = "no-reply@your_domain.com",
)

# CORS
# https://github.com/adamchainz/django-cors-headers

ALLOWED_HOSTS = ['*']

CORS_ORIGIN_ALLOW_ALL = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000",
    "http://localhost:5173",
]

CORS_ORIGIN_WHITELIST = CORS_ALLOWED_ORIGINS

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:8000',
    'http://localhost:5173',
]

CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)

CORS_ALLOW_CREDENTIALS = True

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

#STATIC_ROOT = os.path.join(BASE_DIR, 'static')

STATICFILES_DIRS = [
    BASE_DIR / 'static/',
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
