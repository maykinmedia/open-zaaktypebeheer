from django.utils.translation import gettext_lazy as _

from drf_spectacular.utils import extend_schema
from mozilla_django_oidc_db.models import OpenIDConnectConfig
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ConfigSerializer


class ConfigurationView(APIView):
    authentication_classes = ()
    permission_classes = ()

    @extend_schema(
        summary=_("Retrieve configuration"),
        responses={
            200: ConfigSerializer,
        },
    )
    def get(self, request: Request, *args, **kwargs):
        oidc_config = OpenIDConnectConfig.get_solo()

        serializer = ConfigSerializer(data={"oidc_enabled": oidc_config.enabled})
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data)
