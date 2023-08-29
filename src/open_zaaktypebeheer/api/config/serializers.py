from django.utils.translation import gettext_lazy as _

from rest_framework import serializers


class ConfigSerializer(serializers.Serializer):
    oidc_enabled = serializers.BooleanField(
        label=_("OIDC enabled"), help_text=_("Is OpenID Connect (OIDC) login enabled?")
    )
