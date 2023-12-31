from django.utils.translation import gettext_lazy as _

from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from open_zaaktypebeheer.api.catalogi.constants import OperationStatus, OperationType


class RelationSerializer(serializers.Serializer):
    informatieobjecttype = serializers.URLField(
        label=_("informatieobjecttype URL"),
        help_text=_("The URL of the informatieobjecttype"),
    )
    volgnummer = serializers.IntegerField(min_value=1, label=_("order number"))
    richting = serializers.ChoiceField(
        choices=["inkomend", "intern", "uitgaand"], label=_("direction")
    )
    statustype = serializers.URLField(
        label=_("statustype URL"), required=False, allow_null=True
    )
    url = serializers.URLField(
        label=_("URL"), required=False, help_text=_("URL of the relation if it exists.")
    )


class ExistingZaaktypeInformatieobjecttypeSerializer(RelationSerializer):
    url = serializers.URLField(
        label=_("URL"), required=True, help_text=_("URL of the relation if it exists.")
    )


class RelationsOperationsSerializer(serializers.Serializer):
    to_delete = ExistingZaaktypeInformatieobjecttypeSerializer(many=True)
    to_update = ExistingZaaktypeInformatieobjecttypeSerializer(many=True)
    to_create = RelationSerializer(many=True)


class RelationsToProcessSerializer(serializers.Serializer):
    zaaktype_url = serializers.URLField(
        label=_("zaaktype URL"),
        help_text=_("The URL of the zaaktype to relate"),
    )

    relations = RelationSerializer(many=True)


class RelationError(serializers.Serializer):
    extra_information = serializers.JSONField(
        label=_("extra information"),
        help_text=_(
            "Extra information about the zaaktype-informatieobjecttype relation involved in the operation that caused an error."
        ),
    )
    errors = serializers.ListField(
        label=_("errors"),
        help_text=_(
            "Any error returned by the upstream API when trying "
            "to process a relation between a zaaktype and a informatieobjecttype."
        ),
        child=serializers.JSONField(),
        required=False,
    )
    operation = serializers.ChoiceField(
        label=_("operation"),
        help_text=_("The type of operation that caused an error."),
        choices=OperationType.choices,
    )


class BulkOperationResultSerializer(serializers.Serializer):
    status = serializers.SerializerMethodField(
        label=_("status"),
        help_text=_(
            "Status of the create/update/delete operations on the zaaktype-informatieobjecttype relation. "
            'If any operation returned an error, the status will be ``"failed"``.'
        ),
    )
    failures = RelationError(
        many=True,
        label=_("failures"),
        help_text=_(
            "Failures encountered while performing the create/update/delete "
            "operations on the zaaktype-informatieobjecttype relation."
        ),
        required=False,
    )

    class Meta:
        fields = ("failures", "status")

    @extend_schema_field(serializers.ChoiceField(choices=OperationStatus.choices))
    def get_status(self, obj: dict) -> str:
        if not len(obj["failures"]):
            return OperationStatus.succeeded

        return OperationStatus.failed
