from django.db import models
from django.utils.translation import gettext_lazy as _


class OperationStatus(models.TextChoices):
    succeeded = "succeeded", _("Succeeded")
    failed = "failed", _("failed")


class OperationType(models.TextChoices):
    create = "create", _("Create")
    delete = "delete", _("Delete")
    update = "update", _("Update")
