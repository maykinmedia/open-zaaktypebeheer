from django.core.validators import FileExtensionValidator
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
    theme_class_name = models.SlugField(
        verbose_name=_("theme class name"),
        blank=True,
        help_text=_("If provided, this class name will be set on the <html> element."),
    )
    theme_stylesheet = models.FileField(
        _("theme stylesheet"),
        blank=True,
        upload_to="config/themes/",
        validators=[FileExtensionValidator(allowed_extensions=("css",))],
        help_text=_("A stylesheet with theme-specific css. "),
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
