from rest_framework.routers import DefaultRouter

from .views import InformatieobjecttypenViewSet, ZaaktypenViewSet

app_name = "catalogi"

router = DefaultRouter()
router.register("zaaktypen", ZaaktypenViewSet, basename="zaaktypen")
router.register(
    "informatieobjecttypen",
    InformatieobjecttypenViewSet,
    basename="informatieobjecttypen",
)
# router.register('zaaktype-informatieobjecttypen', ZaaktypenViewSet, basename='zaaktype-informatieobjecttypen')
urlpatterns = router.urls
