import os
from pathlib import Path

# Django-hijack (and Django-hijack-admin)
from django.urls import reverse_lazy

import sentry_sdk
from corsheaders.defaults import default_headers

from .utils import config, get_sentry_integrations

# Build paths inside the project, so further paths can be defined relative to
# the code root.

DJANGO_PROJECT_DIR = Path(__file__).resolve().parent.parent

BASE_DIR = DJANGO_PROJECT_DIR.parent.parent

#
# Core Django settings
#
# SITE_ID = config("SITE_ID", default=1)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY")

# NEVER run with DEBUG=True in production-like environments
DEBUG = config("DEBUG", default=False)

# = domains we're running on
ALLOWED_HOSTS = config("ALLOWED_HOSTS", default="", split=True)

IS_HTTPS = config("IS_HTTPS", default=not DEBUG)

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = "nl-nl"

TIME_ZONE = "Europe/Amsterdam"  # note: this *may* affect the output of DRF datetimes

USE_I18N = True

USE_L10N = True

USE_TZ = True

USE_THOUSAND_SEPARATOR = True

#
# DATABASE and CACHING setup
#
DATABASES = {
    "default": {
        "ENGINE": config("DB_ENGINE", "django.db.backends.postgresql"),
        "NAME": config("DB_NAME", "open_zaaktypebeheer"),
        "USER": config("DB_USER", "open_zaaktypebeheer"),
        "PASSWORD": config("DB_PASSWORD", "open_zaaktypebeheer"),
        "HOST": config("DB_HOST", "localhost"),
        "PORT": config("DB_PORT", 5432),
    }
}

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{config('CACHE_DEFAULT', 'localhost:6379/0')}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
        },
    },
    "axes": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{config('CACHE_AXES', 'localhost:6379/0')}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
        },
    },
    "oidc": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"redis://{config('CACHE_OIDC', 'localhost:6379/0')}",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "IGNORE_EXCEPTIONS": True,
        },
    },
}


#
# APPLICATIONS enabled for this project
#

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.sessions",
    "django.contrib.contenttypes",
    # NOTE: If enabled, at least one Site object is required and
    # uncomment SITE_ID above.
    # 'django.contrib.sites',
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Admin auth
    "django_otp",
    "django_otp.plugins.otp_static",
    "django_otp.plugins.otp_totp",
    "mozilla_django_oidc",
    "mozilla_django_oidc_db",
    "two_factor",
    # Optional applications.
    "ordered_model",
    "django_admin_index",
    "django.contrib.admin",
    # External applications.
    "axes",
    "django_better_admin_arrayfield",
    "hijack",
    "hijack.contrib.admin",
    "solo",
    "rest_framework",
    "drf_spectacular",
    "corsheaders",
    "zgw_consumers",
    "simple_certmanager",
    # Project applications.
    "open_zaaktypebeheer.accounts",
    "open_zaaktypebeheer.utils",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    # 'django.middleware.locale.LocaleMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "open_zaaktypebeheer.middleware.CsrfTokenMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "mozilla_django_oidc_db.middleware.SessionRefresh",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "axes.middleware.AxesMiddleware",
    "hijack.middleware.HijackUserMiddleware",
    "django_otp.middleware.OTPMiddleware",
]

ROOT_URLCONF = "open_zaaktypebeheer.urls"

# List of callables that know how to import templates from various sources.
TEMPLATE_LOADERS = (
    "django.template.loaders.filesystem.Loader",
    "django.template.loaders.app_directories.Loader",
)

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [DJANGO_PROJECT_DIR / "templates"],
        "APP_DIRS": False,  # conflicts with explicitly specifying the loaders
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "open_zaaktypebeheer.utils.context_processors.settings",
            ],
            "loaders": TEMPLATE_LOADERS,
        },
    },
]

WSGI_APPLICATION = "open_zaaktypebeheer.wsgi.application"

# Translations
LOCALE_PATHS = (DJANGO_PROJECT_DIR / "conf" / "locale",)

#
# SERVING of static and media files
#

STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "static"

# Additional locations of static files
STATICFILES_DIRS = [DJANGO_PROJECT_DIR / "static"]

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

MEDIA_ROOT = BASE_DIR / "media"

MEDIA_URL = "/media/"

FILE_UPLOAD_PERMISSIONS = 0o644

#
# Sending EMAIL
#
EMAIL_HOST = config("EMAIL_HOST", default="localhost")
EMAIL_PORT = config(
    "EMAIL_PORT", default=25
)  # disabled on Google Cloud, use 487 instead
EMAIL_HOST_USER = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = config("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_TLS = config("EMAIL_USE_TLS", default=False)
EMAIL_TIMEOUT = 10

DEFAULT_FROM_EMAIL = "open_zaaktypebeheer@example.com"

#
# LOGGING
#
LOG_STDOUT = config("LOG_STDOUT", default=False)

LOGGING_DIR = BASE_DIR / "log"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "%(asctime)s %(levelname)s %(name)s %(module)s %(process)d %(thread)d  %(message)s"
        },
        "timestamped": {"format": "%(asctime)s %(levelname)s %(name)s  %(message)s"},
        "simple": {"format": "%(levelname)s  %(message)s"},
        "performance": {
            "format": "%(asctime)s %(process)d | %(thread)d | %(message)s",
        },
    },
    "filters": {
        "require_debug_false": {"()": "django.utils.log.RequireDebugFalse"},
    },
    "handlers": {
        "mail_admins": {
            "level": "ERROR",
            "filters": ["require_debug_false"],
            "class": "django.utils.log.AdminEmailHandler",
        },
        "null": {
            "level": "DEBUG",
            "class": "logging.NullHandler",
        },
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "timestamped",
        },
        "django": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGGING_DIR / "django.log",
            "formatter": "verbose",
            "maxBytes": 1024 * 1024 * 10,  # 10 MB
            "backupCount": 10,
        },
        "project": {
            "level": "DEBUG",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGGING_DIR / "open_zaaktypebeheer.log",
            "formatter": "verbose",
            "maxBytes": 1024 * 1024 * 10,  # 10 MB
            "backupCount": 10,
        },
        "performance": {
            "level": "INFO",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": LOGGING_DIR / "performance.log",
            "formatter": "performance",
            "maxBytes": 1024 * 1024 * 10,  # 10 MB
            "backupCount": 10,
        },
    },
    "loggers": {
        "open_zaaktypebeheer": {
            "handlers": ["project"] if not LOG_STDOUT else ["console"],
            "level": "INFO",
            "propagate": True,
        },
        "django.request": {
            "handlers": ["django"] if not LOG_STDOUT else ["console"],
            "level": "ERROR",
            "propagate": True,
        },
        "django.template": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": True,
        },
        "mozilla_django_oidc": {
            "handlers": ["project"],
            "level": "DEBUG",
        },
    },
}

#
# AUTH settings - user accounts, passwords, backends...
#
AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]


# Allow logging in with both username+password and email+password
AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesBackend",
    "open_zaaktypebeheer.accounts.backends.UserModelEmailBackend",
    "django.contrib.auth.backends.ModelBackend",
    "mozilla_django_oidc_db.backends.OIDCAuthenticationBackend",
]

SESSION_COOKIE_NAME = "open_zaaktypebeheer_sessionid"
SESSION_ENGINE = "django.contrib.sessions.backends.cache"

LOGIN_URL = reverse_lazy("admin:login")
LOGIN_REDIRECT_URL = reverse_lazy("admin:index")
LOGOUT_REDIRECT_URL = reverse_lazy("admin:index")

#
# SECURITY settings
#
SESSION_COOKIE_SECURE = IS_HTTPS
SESSION_COOKIE_HTTPONLY = True

CSRF_COOKIE_SECURE = IS_HTTPS
CSRF_FAILURE_VIEW = "open_zaaktypebeheer.accounts.views.csrf_failure"

X_FRAME_OPTIONS = "DENY"

#
# FIXTURES
#

FIXTURE_DIRS = (DJANGO_PROJECT_DIR / "fixtures",)

#
# Custom settings
#
PROJECT_NAME = "open_zaaktypebeheer"
ENVIRONMENT = config("ENVIRONMENT", "")
SHOW_ALERT = True
ENABLE_ADMIN_NAV_SIDEBAR = config("ENABLE_ADMIN_NAV_SIDEBAR", default=False)

# This setting is used by the csrf_failure view (accounts app).
# You can specify any path that should match the request.path
# Note: the LOGIN_URL Django setting is not used because you could have
# multiple login urls defined.
LOGIN_URLS = [reverse_lazy("admin:login")]

if "GIT_SHA" in os.environ:
    GIT_SHA = config("GIT_SHA", "")
# in docker (build) context, there is no .git directory
elif (BASE_DIR / ".git").exists():
    try:
        import git
    except ImportError:
        GIT_SHA = None
    else:
        repo = git.Repo(search_parent_directories=True)
        try:
            GIT_SHA = repo.head.object.hexsha
        except (
            ValueError
        ):  # on startproject initial runs before any git commits have been made
            GIT_SHA = repo.active_branch.name
else:
    GIT_SHA = None

RELEASE = config("RELEASE", GIT_SHA)

##############################
#                            #
# 3RD PARTY LIBRARY SETTINGS #
#                            #
##############################

#
# Django-Admin-Index
#
ADMIN_INDEX_SHOW_REMAINING_APPS = False
ADMIN_INDEX_AUTO_CREATE_APP_GROUP = False
ADMIN_INDEX_SHOW_REMAINING_APPS_TO_SUPERUSERS = True
ADMIN_INDEX_DISPLAY_DROP_DOWN_MENU_CONDITION_FUNCTION = (
    "open_zaaktypebeheer.utils.django_two_factor_auth.should_display_dropdown_menu"
)

#
# DJANGO-AXES (6.0+)
#
AXES_CACHE = "axes"  # refers to CACHES setting
# The number of login attempts allowed before a record is created for the
# failed logins. Default: 3
AXES_FAILURE_LIMIT = 10
# If set, defines a period of inactivity after which old failed login attempts
# will be forgotten. Can be set to a python timedelta object or an integer. If
# an integer, will be interpreted as a number of hours. Default: None
AXES_COOLOFF_TIME = 1
# If True only locks based on user id and never locks by IP if attempts limit
# exceed, otherwise utilize the existing IP and user locking logic Default:
# False
# If set, specifies a template to render when a user is locked out. Template
# receives cooloff_time and failure_limit as context variables. Default: None
AXES_LOCKOUT_TEMPLATE = "account_blocked.html"
AXES_LOCKOUT_PARAMETERS = [["ip_address", "user_agent", "username"]]


# The default meta precedence order
IPWARE_META_PRECEDENCE_ORDER = (
    "HTTP_X_FORWARDED_FOR",
    "X_FORWARDED_FOR",  # <client>, <proxy1>, <proxy2>
    "HTTP_CLIENT_IP",
    "HTTP_X_REAL_IP",
    "HTTP_X_FORWARDED",
    "HTTP_X_CLUSTER_CLIENT_IP",
    "HTTP_FORWARDED_FOR",
    "HTTP_FORWARDED",
    "HTTP_VIA",
    "REMOTE_ADDR",
)

#
# Maykin fork of DJANGO-TWO-FACTOR-AUTH
#
TWO_FACTOR_FORCE_OTP_ADMIN = config("TWO_FACTOR_FORCE_OTP_ADMIN", default=not DEBUG)
TWO_FACTOR_PATCH_ADMIN = config("TWO_FACTOR_PATCH_ADMIN", default=True)

#
# DJANGO-HIJACK
#
HIJACK_LOGIN_REDIRECT_URL = "/"
HIJACK_LOGOUT_REDIRECT_URL = reverse_lazy("admin:accounts_user_changelist")
HIJACK_REGISTER_ADMIN = False
# This is a CSRF-security risk.
# See: http://django-hijack.readthedocs.io/en/latest/configuration/#allowing-get-method-for-hijack-views
HIJACK_ALLOW_GET_REQUESTS = True

#
# SENTRY - error monitoring
#
SENTRY_DSN = config("SENTRY_DSN", None)

if SENTRY_DSN:
    SENTRY_CONFIG = {
        "dsn": SENTRY_DSN,
        "release": RELEASE,
        "environment": ENVIRONMENT,
    }

    sentry_sdk.init(
        **SENTRY_CONFIG, integrations=get_sentry_integrations(), send_default_pii=True
    )

# Elastic APM
ELASTIC_APM_SERVER_URL = os.getenv("ELASTIC_APM_SERVER_URL", None)
ELASTIC_APM = {
    "SERVICE_NAME": f"open_zaaktypebeheer {ENVIRONMENT}",
    "SECRET_TOKEN": config("ELASTIC_APM_SECRET_TOKEN", "default"),
    "SERVER_URL": ELASTIC_APM_SERVER_URL,
}
if not ELASTIC_APM_SERVER_URL:
    ELASTIC_APM["ENABLED"] = False
    ELASTIC_APM["SERVER_URL"] = "http://localhost:8200"

# Subpath (optional)
# This environment variable can be configured during deployment.
SUBPATH = config("SUBPATH", None)
if SUBPATH:
    SUBPATH = f"/{SUBPATH.strip('/')}"

#
# Mozilla Django OIDC db
#

OIDC_AUTHENTICATE_CLASS = "mozilla_django_oidc_db.views.OIDCAuthenticationRequestView"
OIDC_CALLBACK_CLASS = "mozilla_django_oidc_db.views.OIDCCallbackView"
MOZILLA_DJANGO_OIDC_DB_CACHE = "oidc"
MOZILLA_DJANGO_OIDC_DB_CACHE_TIMEOUT = 1
OIDC_REDIRECT_ALLOWED_HOSTS = config(
    "OIDC_REDIRECT_ALLOWED_HOSTS", split=True, default=[]
)

#
# SOLO
#
SOLO_CACHE = "default"
SOLO_CACHE_TIMEOUT = 60 * 5  # 5 mins

#
# DJANGO REST FRAMEWORK
#
ENABLE_THROTTLING = config("ENABLE_THROTTLING", default=True)

throttle_rate_anon = (
    config("THROTTLE_RATE_ANON", default="2500/hour") if ENABLE_THROTTLING else None
)
throttle_rate_user = (
    config("THROTTLE_RATE_USER", default="15000/hour") if ENABLE_THROTTLING else None
)

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
        "rest_framework.throttling.ScopedRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        # used by regular throttle classes
        "anon": throttle_rate_anon,
        "user": throttle_rate_user,
    },
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

#
# SPECTACULAR - OpenAPI schema generation
#
_DESCRIPTION = """
Open Zaaktypebeheer provides an API to manage relating document types and case types
(in Dutch: informatieobjecttypen en zaaktypen).
"""

API_VERSION = "0.1.0"

SPECTACULAR_SETTINGS = {
    "SCHEMA_PATH_PREFIX": "/api/v1",
    "TITLE": "Open Zaaktypebeheer API",
    "DESCRIPTION": _DESCRIPTION,
    "VERSION": API_VERSION,
}

#
# Django CORS-headers
#

# This is reflected in the access-control-allow-origin header
# An origin is the scheme (http/https) + the domain name + port number
CORS_ALLOWED_ORIGINS = config("CORS_ALLOWED_ORIGINS", split=True, default=[])
CORS_ALLOWED_ORIGIN_REGEXES = config(
    "CORS_ALLOWED_ORIGIN_REGEXES", split=True, default=[]
)
CORS_ALLOW_ALL_ORIGINS = config("CORS_ALLOW_ALL_ORIGINS", default=False)

# This is reflected in the Access-Control-Allow-Headers response header.
# It is used in response to a preflight request to indicate which headers can be included in the actual request.
CORS_EXTRA_ALLOW_HEADERS = config("CORS_EXTRA_ALLOW_HEADERS", split=True, default=[])
CORS_ALLOW_HEADERS = (
    *default_headers,
    *CORS_EXTRA_ALLOW_HEADERS,
)

# Reflected in the Access-Control-Expose-Headers header
# Specifies which response headers are exposed to JS in cross-origin requests.
CORS_EXPOSE_HEADERS = ["X-CSRFToken"]

# Reflected in the Access-Control-Allow-Credentials header.
# This response header tells the browser whether to expose the response to the JS when the request's credentials mode
# is 'include'. When used in a preflight response, it tells whether to send credentials (in our case, the cookies).
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = config(
    "CSRF_TRUSTED_ORIGINS",
    split=True,
    default=[],
)

#
# ZGW consumers
#
ZGW_CONSUMERS_TEST_SCHEMA_DIRS = [
    os.path.join(BASE_DIR, "src/open_zaaktypebeheer/api/catalogi/tests/files")
]
