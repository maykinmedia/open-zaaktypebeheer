from django.db import models
from django.utils.translation import gettext_lazy as _

from solo.models import SingletonModel


class GeneralConfiguration(SingletonModel):
    logo = models.ImageField(
        verbose_name=_("logo"),
        upload_to="logo/",
        blank=True,
        help_text=_("The logo that will be displayed in the frontend."),
    )
    favicon = models.ImageField(
        verbose_name=_("favicon"),
        upload_to="logo/",
        blank=True,
        help_text=_("The favicon that will be displayed in the browser tabs."),
    )
    openzaak_admin_url = models.URLField(
        verbose_name=_("openzaak admin URL"),
        help_text=_(
            "The URL of the Open Zaak admin. A link is shown to the users if they want to perform actions "
            "that are not possible via Open Zaaktypebeheer."
        ),
        blank=True,
        max_length=1000,
    )
