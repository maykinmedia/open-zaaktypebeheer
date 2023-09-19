from django.utils.translation import gettext_lazy as _

from drf_spectacular.utils import extend_schema_field
from mozilla_django_oidc_db.models import OpenIDConnectConfig
from rest_framework import serializers
from rest_framework.reverse import reverse

from .models import GeneralConfiguration


class ConfigSerializer(serializers.ModelSerializer):
    oidc_enabled = serializers.SerializerMethodField(
        label=_("OIDC enabled"), help_text=_("Is OpenID Connect (OIDC) login enabled?")
    )
    oidc_login_url = serializers.SerializerMethodField(
        label=_("OIDC authentication URL"),
        help_text=_("URL where to start the OIDC login flow if it is enabled."),
        required=False,
    )

    class Meta:
        model = GeneralConfiguration
        fields = (
            "oidc_enabled",
            "logo",
            "favicon",
            "theme_stylesheet",
            "theme_class_name",
            "openzaak_admin_url",
            "oidc_login_url",
        )

    @extend_schema_field(serializers.BooleanField)
    def get_oidc_enabled(self, obj: GeneralConfiguration) -> bool:
        oidc_config = OpenIDConnectConfig.get_solo()
        return oidc_config.enabled

    @extend_schema_field(serializers.URLField)
    def get_oidc_login_url(self, obj: GeneralConfiguration) -> str:
        request = self.context.get("request")
        return reverse("oidc_authentication_init", request=request)
