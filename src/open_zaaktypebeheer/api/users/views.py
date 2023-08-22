from django.utils.translation import gettext_lazy as _

from drf_spectacular.utils import extend_schema
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer


@extend_schema(
    summary=_("Me"),
    description=_("Get information about the current user."),
    responses={
        200: UserSerializer,
    },
)
class UserMeView(APIView):
    def get(self, request: Request) -> Response:
        serializer = UserSerializer(instance=request.user)
        return Response(serializer.data)
