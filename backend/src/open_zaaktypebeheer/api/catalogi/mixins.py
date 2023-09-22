from rest_framework.response import Response
from zds_client import ClientError


class ProxyMixin:
    def handle_exception(self, exc):
        if isinstance(exc, ClientError):
            upstream_error = exc.args[0]
            return Response(status=upstream_error["status"], data=exc.args[0])
        return super().handle_exception(exc)
