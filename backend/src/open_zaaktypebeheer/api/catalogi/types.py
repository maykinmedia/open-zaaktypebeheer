from typing import TypedDict


class RelationsOperationsDict(TypedDict):
    to_delete: list[dict]
    to_create: list[dict]
    to_update: list[dict]


class RelationErrorInfo(TypedDict):
    extra_information: dict
    errors: list
    operation: str
