from zgw_consumers.client import ZGWClient
from zgw_consumers.models import Service


class NoServiceConfigured(Exception):
    pass


def get_client(api_type) -> ZGWClient:
    service = Service.objects.filter(api_type=api_type).first()
    if not service:
        raise NoServiceConfigured("No service defined for api_type {}", api_type)

    return service.build_client()
