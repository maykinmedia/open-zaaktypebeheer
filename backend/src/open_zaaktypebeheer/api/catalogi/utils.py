import logging
from datetime import date
from functools import partial

from requests import HTTPError
from zds_client import ClientError
from zgw_consumers.api_models.types import JSONObject
from zgw_consumers.client import ZGWClient
from zgw_consumers.concurrent import parallel
from zgw_consumers.service import get_paginated_results

from .constants import OperationType
from .serializers import RelationsOperationsSerializer
from .types import RelationErrorInfo, RelationsOperationsDict

logger = logging.getLogger(__name__)


def fetch_informatieobjecttypen(urls: list[str], client: ZGWClient) -> list[JSONObject]:
    def _fetch(url: str):
        return client.retrieve("informatieobjecttype", url=url)

    with parallel() as executor:
        resp_data = executor.map(_fetch, urls)

    return list(resp_data)


def add_relation_information(zaaktype: dict, client: ZGWClient) -> list:
    if not zaaktype.get("informatieobjecttypen", []):
        return []

    # Resolve the zaaktype-informatieobjecttypen relations
    relations = get_paginated_results(
        client=client,
        resource="zaakinformatieobjecttype",
        request_kwargs={"params": {"zaaktype": zaaktype["url"], "status": "alles"}},
    )

    # Resolve the related informatieobjecttypen
    iots_urls = [relation["informatieobjecttype"] for relation in relations]
    related_iots = fetch_informatieobjecttypen(
        urls=iots_urls,
        client=client,
    )
    related_iots = {iot["url"]: iot for iot in related_iots}

    # Add informatieobjecttype data to the relation
    updated_relations = [
        {
            **relation,
            "informatieobjecttype": related_iots[relation["informatieobjecttype"]],
        }
        for relation in relations
    ]

    return updated_relations


def add_statustypen_information(zaaktype: dict, client: ZGWClient) -> list:
    if not zaaktype.get("statustypen", []):
        return []

    statustypen = get_paginated_results(
        client=client,
        resource="statustype",
        request_kwargs={"params": {"zaaktype": zaaktype["url"], "status": "alles"}},
    )

    return statustypen


def relation_has_changed(new_relation: dict, old_relation: dict) -> bool:
    new_status_type = new_relation.get("statustype") or ""
    old_status_type = old_relation.get("statustype") or ""

    return (
        new_relation["volgnummer"] != old_relation["volgnummer"]
        or new_relation["richting"] != old_relation["richting"]
        or new_status_type != old_status_type
    )


def get_relations_to_process(
    existing_relations: dict[str, dict], relations_to_process: dict[str, dict]
) -> RelationsOperationsDict:
    """
    Check which relations should be deleted/updated/created
    """
    relations = RelationsOperationsDict(to_delete=[], to_create=[], to_update=[])

    relations["to_delete"] = [
        relation
        for informatieobjecttype_url, relation in existing_relations.items()
        if informatieobjecttype_url not in relations_to_process
    ]

    for informatieobjecttype_url, relation in relations_to_process.items():
        if informatieobjecttype_url not in existing_relations:
            relations["to_create"].append(relation)
            continue

        if relation_has_changed(relation, existing_relations[informatieobjecttype_url]):
            relations["to_update"].append(relation)

    serializer = RelationsOperationsSerializer(data=relations)
    serializer.is_valid(raise_exception=True)

    return relations


def _delete(client: ZGWClient, relation: dict) -> RelationErrorInfo | None:
    try:
        client.delete(resource="zaakinformatieobjecttype", url=relation["url"])
    except (ClientError, HTTPError) as exc:
        logger.exception("Failed to delete relation %s.", relation["url"], exc_info=exc)
        return RelationErrorInfo(
            extra_information=relation, errors=exc.args, operation=OperationType.delete
        )


def _create(client: ZGWClient, relation: dict) -> RelationErrorInfo | None:
    try:
        client.create(
            resource="zaakinformatieobjecttype",
            data=relation,
        )
    except (ClientError, HTTPError) as exc:
        logger.exception(
            "Failed to create relation between %s and %s.",
            relation["informatieobjecttype"],
            relation["zaaktype"],
            exc_info=exc,
        )
        return RelationErrorInfo(
            extra_information=relation, errors=exc.args, operation=OperationType.create
        )


def process_relations(
    relations_to_process: RelationsOperationsDict, client: ZGWClient
) -> list[RelationErrorInfo]:
    with parallel() as executor:
        _results_delete = executor.map(
            partial(_delete, client),
            relations_to_process["to_delete"] + relations_to_process["to_update"],
        )
        # The deletions need to be finished before we can start creating. This is due to the relations to update (Issue #37)
        # If we are changing 2 relations by swapping their volgnummer, they first have to be deleted, otherwise the
        # unique-together constraint of zaaktype/volgnummer is violated when the first relation is updated
        # (Open Zaak returns an error).
        results_delete = list(_results_delete)

        _results_create = executor.map(
            partial(_create, client),
            relations_to_process["to_create"] + relations_to_process["to_update"],
        )

    results = results_delete + list(_results_create)
    return [info for info in results if info]


def add_active_information(zaaktypen: list[dict]) -> list[dict]:
    today = date.today()

    def calculate_is_active(zaaktype: dict) -> dict:
        start_validity = date.fromisoformat(zaaktype["beginGeldigheid"])
        end_validity = (
            date.fromisoformat(zaaktype["eindeGeldigheid"])
            if zaaktype.get("eindeGeldigheid")
            else None
        )

        is_active = today >= start_validity and (
            end_validity is None or today < end_validity
        )

        zaaktype["actief"] = is_active
        return zaaktype

    with parallel() as executor:
        processed_zaaktypen = executor.map(calculate_is_active, zaaktypen)

    return list(processed_zaaktypen)
