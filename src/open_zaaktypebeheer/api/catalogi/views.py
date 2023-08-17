from uuid import UUID

from django.utils.translation import gettext_lazy as _

from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from zgw_consumers.constants import APITypes
from zgw_consumers.service import get_paginated_results

from .client import get_client
from .mixins import ProxyMixin
from .utils import fetch_informatieobjecttypen


@extend_schema_view(
    list=extend_schema(
        summary=_("List zaaktypen"),
        description=_("Retrieve zaaktypen using the configured ZTC service."),
    ),
    retrieve=extend_schema(
        summary=_("Retrieve zaaktype"),
        description=_(
            "Retrieve a zaaktype using the configured ZTC service. The related informatieobjecttypen are resolved."
        ),
    ),
)
class ZaaktypenViewSet(ProxyMixin, viewsets.ViewSet):
    lookup_field = "uuid"

    def list(self, request: Request) -> Response:
        client = get_client(APITypes.ztc)

        zaaktypen_list = get_paginated_results(
            client=client,
            resource="zaaktype",
            request_kwargs={"params": request.query_params},
        )

        return Response(zaaktypen_list)

    def retrieve(self, request: Request, uuid: UUID):
        client = get_client(APITypes.ztc)

        zaaktype = client.retrieve(
            resource="zaaktype", url=f"/catalogi/api/v1/zaaktypen/{uuid}"
        )

        # Resolve the related informatieobjecttypen
        related_iots = fetch_informatieobjecttypen(
            urls=zaaktype.get("informatieobjecttypen", []), client=client
        )
        zaaktype["informatieobjecttypen"] = related_iots

        return Response(zaaktype)


@extend_schema_view(
    list=extend_schema(
        summary=_("List informatieobjecttypen"),
        description=_(
            "Retrieve informatieobjecttypen using the configured ZTC service."
        ),
    ),
)
class InformatieobjecttypenViewSet(ProxyMixin, viewsets.ViewSet):
    def list(self, request: Request):
        client = get_client(APITypes.ztc)

        informatieobjecttypen = get_paginated_results(
            client=client,
            resource="informatieobjecttype",
            request_kwargs={"params": request.query_params},
        )

        return Response(informatieobjecttypen)
