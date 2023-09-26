import factory
from zgw_consumers.models import Service


class ServiceFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Service
