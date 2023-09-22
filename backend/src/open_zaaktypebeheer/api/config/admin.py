from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from solo.admin import SingletonModelAdmin

from .models import GeneralConfiguration


@admin.register(GeneralConfiguration)
class GeneralConfigurationAdmin(SingletonModelAdmin):
    fieldsets = (
        (
            _("Styling"),
            {
                "fields": ("logo", "favicon", "theme_class_name", "theme_stylesheet"),
            },
        ),
        (_("Open zaak"), {"fields": ("openzaak_admin_url",)}),
    )
