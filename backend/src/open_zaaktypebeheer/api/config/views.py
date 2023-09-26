from django.utils.translation import gettext_lazy as _

from drf_spectacular.utils import extend_schema
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import GeneralConfiguration
from .serializers import ConfigSerializer


class ConfigurationView(APIView):
    authentication_classes = ()
    permission_classes = ()

    @extend_schema(
        summary=_("Retrieve configuration"),
        description=_("Returns configuration fields that are needed by the frontend. "),
        responses={
            200: ConfigSerializer,
        },
    )
    def get(self, request: Request, *args, **kwargs):
        config = GeneralConfiguration.get_solo()
        serializer = ConfigSerializer(instance=config, context={"request": request})
        return Response(serializer.data)
