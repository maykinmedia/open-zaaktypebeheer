from django.contrib.auth import login

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializer import AuthSerializer


class LoginView(APIView):
    permission_classes = ()
    serializer_class = AuthSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        login(request, serializer.validated_data["user"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class LogoutView(APIView):
    pass
