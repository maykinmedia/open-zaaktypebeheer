from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import (
    CatalogussenViewSet,
    InformatieobjecttypenViewSet,
    ZaaktypenViewSet,
    ZaakypeInformatieobjecttypeViewSet,
)

app_name = "catalogi"

router = DefaultRouter()
router.register("zaaktypen", ZaaktypenViewSet, basename="zaaktypen")
router.register(
    "informatieobjecttypen",
    InformatieobjecttypenViewSet,
    basename="informatieobjecttypen",
)
router.register("catalogussen", CatalogussenViewSet, basename="catalogussen")

urlpatterns = router.urls + [
    path(
        "zaaktype-informatieobjecttypen/",
        ZaakypeInformatieobjecttypeViewSet.as_view(),
        name="zaaktype-informatieobjecttypen",
    ),
]
