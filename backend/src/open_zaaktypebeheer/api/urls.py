from django.urls import include, path

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularJSONAPIView,
    SpectacularRedocView,
)

app_name = "api"

urlpatterns = [
    # API documentation
    path(
        "docs/",
        SpectacularRedocView.as_view(url_name="api:api-schema-json"),
        name="api-docs",
    ),
    path(
        "v1/",
        include(
            [
                path(
                    "",
                    SpectacularJSONAPIView.as_view(schema=None),
                    name="api-schema-json",
                ),
                path("schema", SpectacularAPIView.as_view(schema=None), name="schema"),
            ]
        ),
    ),
    # Authentication
    path(
        "v1/auth/",
        include(
            "open_zaaktypebeheer.api.authentication.urls", namespace="authentication"
        ),
    ),
    # Actual endpoints
    path(
        "v1/users/",
        include("open_zaaktypebeheer.api.users.urls", namespace="users"),
    ),
    path(
        "v1/catalogi/",
        include("open_zaaktypebeheer.api.catalogi.urls", namespace="catalogi"),
    ),
    path(
        "v1/config/", include("open_zaaktypebeheer.api.config.urls", namespace="config")
    ),
]
