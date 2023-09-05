from django.utils.translation import gettext_lazy as _

from drf_spectacular.utils import extend_schema_field
from mozilla_django_oidc_db.models import OpenIDConnectConfig
from rest_framework import serializers

from .models import GeneralConfiguration


class ConfigSerializer(serializers.ModelSerializer):
    oidc_enabled = serializers.SerializerMethodField(
        label=_("OIDC enabled"), help_text=_("Is OpenID Connect (OIDC) login enabled?")
    )

    class Meta:
        model = GeneralConfiguration
        fields = (
            "oidc_enabled",
            "logo",
            "favicon",
            "openzaak_admin_url",
        )
        # Allow list for non-authenticated users
        public_fields = (
            "oidc_enabled",
            "logo",
            "favicon",
        )

    def get_fields(self):
        fields = super().get_fields()

        request = self.context.get("request")

        # If the user is authenticated, return all the fields
        if not request.user.is_anonymous:
            return fields

        return {
            field_key: field_value
            for field_key, field_value in fields.items()
            if field_key in self.Meta.public_fields
        }

    @extend_schema_field(serializers.BooleanField)
    def get_oidc_enabled(self, obj: GeneralConfiguration) -> bool:
        oidc_config = OpenIDConnectConfig.get_solo()
        return oidc_config.enabled
