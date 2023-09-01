import logging
from dataclasses import dataclass, field
from functools import partial
from typing import TypedDict

from requests import HTTPError
from zds_client import ClientError
from zgw_consumers.api_models.types import JSONObject
from zgw_consumers.client import ZGWClient
from zgw_consumers.concurrent import parallel

from .constants import OperationType

logger = logging.getLogger(__name__)


def fetch_informatieobjecttypen(urls: list[str], client: ZGWClient) -> list[JSONObject]:
    def _fetch(url: str):
        return client.retrieve("informatieobjecttype", url=url)

    with parallel() as executor:
        resp_data = executor.map(_fetch, urls)

    return list(resp_data)


@dataclass
class RelationsOperations:
    to_delete: list[dict] = field(default_factory=list)
    to_create: list[dict] = field(default_factory=list)
    to_update: list[dict] = field(default_factory=list)


class RelationErrorInfo(TypedDict):
    extra: dict
    errors: list
    operation: str


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
) -> RelationsOperations:
    """
    Check which relations should be deleted/updated/created
    """
    relations = RelationsOperations()

    relations.to_delete = [
        relation
        for informatieobjecttype_url, relation in existing_relations.items()
        if informatieobjecttype_url not in relations_to_process
    ]

    for informatieobjecttype_url, relation in relations_to_process.items():
        if informatieobjecttype_url not in existing_relations:
            relations.to_create.append(relation)
            continue

        if relation_has_changed(relation, existing_relations[informatieobjecttype_url]):
            relations.to_update.append(relation)

    return relations


def _delete(client: ZGWClient, relation: dict) -> RelationErrorInfo | None:
    try:
        client.delete(resource="zaakinformatieobjecttype", url=relation["url"])
    except (ClientError, HTTPError) as exc:
        logger.exception("Failed to delete relation %s.", relation["url"], exc_info=exc)
        return RelationErrorInfo(
            extra=relation, errors=exc.args, operation=OperationType.delete
        )


def _update(client: ZGWClient, relation: dict) -> RelationErrorInfo | None:
    try:
        client.partial_update(
            resource="zaakinformatieobjecttype",
            url=relation["url"],
            data=relation,
        )
    except (ClientError, HTTPError) as exc:
        logger.exception("Failed to update relation %s.", relation["url"], exc_info=exc)
        return RelationErrorInfo(
            extra=relation, errors=exc.args, operation=OperationType.update
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
            extra=relation, errors=exc.args, operation=OperationType.create
        )


def process_relations(
    relations_to_process: RelationsOperations, client: ZGWClient
) -> list[RelationErrorInfo]:
    with parallel() as executor:
        results_delete = executor.map(
            partial(_delete, client), relations_to_process.to_delete
        )
        results_create = executor.map(
            partial(_create, client), relations_to_process.to_create
        )
        results_update = executor.map(
            partial(_update, client), relations_to_process.to_update
        )

    results = list(results_delete) + list(results_update) + list(results_create)
    return [info for info in results if info]
