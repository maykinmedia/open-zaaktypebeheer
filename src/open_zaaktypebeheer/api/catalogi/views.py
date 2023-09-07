from uuid import UUID

from django.utils.translation import gettext_lazy as _

from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import viewsets
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from zgw_consumers.constants import APITypes
from zgw_consumers.service import get_paginated_results

from .client import get_client
from .mixins import ProxyMixin
from .serializers import (
    BulkOperationResultSerializer,
    RelationsOperationsSerializer,
    RelationsToProcessSerializer,
)
from .utils import (
    add_relation_information,
    add_statustypen_information,
    get_relations_to_process,
    process_relations,
)


@extend_schema_view(
    list=extend_schema(
        summary=_("List zaaktypen"),
        description=_("Retrieve zaaktypen using the configured ZTC service."),
    ),
    retrieve=extend_schema(
        summary=_("Retrieve zaaktype"),
        description=_(
            "Retrieve a zaaktype using the configured ZTC service. "
            "The related zaaktype-informatieobjecttypen and informatieobjecttypen are resolved."
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

        zaaktype["informatieobjecttypen"] = add_relation_information(zaaktype, client)
        zaaktype["statustypen"] = add_statustypen_information(zaaktype, client)
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


class ZaakypeInformatieobjecttypeViewSet(ProxyMixin, APIView):
    @extend_schema(
        summary=_("Bulk update zaaktype-informatieobjecttypen"),
        description=_("Create/Update/Delete zaaktype-informatieobjecttype relations."),
        request=RelationsToProcessSerializer,
        responses={
            200: BulkOperationResultSerializer,
            400: RelationsOperationsSerializer,
        },
    )
    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = RelationsToProcessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        client = get_client(APITypes.ztc)

        results = get_paginated_results(
            client=client,
            resource="zaakinformatieobjecttype",
            request_kwargs={
                "params": {"zaaktype": data["zaaktype_url"], "status": "concept"}
            },
        )

        existing_relations = {item["informatieobjecttype"]: item for item in results}
        new_relations = {
            item["informatieobjecttype"]: {**item, "zaaktype": data["zaaktype_url"]}
            for item in data["relations"]
        }

        relations_to_proces = get_relations_to_process(
            existing_relations, new_relations
        )

        errors = process_relations(relations_to_proces, client)

        serializer = BulkOperationResultSerializer(instance={"failures": errors})
        return Response(serializer.data)
