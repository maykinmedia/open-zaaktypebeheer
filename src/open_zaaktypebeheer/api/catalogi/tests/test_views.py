from requests_mock import Mocker
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from zgw_consumers.constants import APITypes
from zgw_consumers.test.component_generation import generate_oas_component
from zgw_consumers.test.schema_mock import mock_service_oas_get

from open_zaaktypebeheer.accounts.tests.factories import UserFactory

from .factories import ServiceFactory


class ZaaktypeViewTests(APITestCase):
    def test_not_authenticated(self):
        zaaktypen_url = reverse("api:catalogi:zaaktypen-list")

        response = self.client.get(zaaktypen_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @Mocker()
    def test_retrieve_zaaktypen(self, m):
        user = UserFactory.create(username="test", password="password")
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktypen",
            json={
                "results": [
                    generate_oas_component(
                        "catalogi",
                        "schemas/ZaakType",
                        url="https://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                    )
                ]
            },
        )
        ServiceFactory.create(
            api_type=APITypes.ztc,
            api_root="http://catalogi-api.nl/catalogi/api/v1",
            oas="http://catalogi-api.nl/api/schema/openapi.yaml",
        )

        self.client.force_authenticate(user=user)
        response = self.client.get(reverse("api:catalogi:zaaktypen-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertTrue(isinstance(data, list))
        self.assertEqual(
            data[0]["url"],
            "https://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
        )

    @Mocker()
    def test_upstream_raises_error(self, m):
        user = UserFactory.create(username="test", password="password")
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktypen",
            status_code=404,
            json={
                "type": "http://catalogi-api.nl/ref/fouten/NotFound/",
                "code": "not_found",
                "title": "Niet gevonden.",
                "status": 404,
                "detail": "Niet gevonden.",
                "instance": "urn:uuid:abd3add1-beb8-4d1e-97fd-589b4d797956",
            },
        )
        ServiceFactory.create(
            api_type=APITypes.ztc,
            api_root="http://catalogi-api.nl/catalogi/api/v1",
            oas="http://catalogi-api.nl/api/schema/openapi.yaml",
        )

        self.client.force_authenticate(user=user)
        response = self.client.get(reverse("api:catalogi:zaaktypen-list"))

        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            response.json(),
            {
                "type": "http://catalogi-api.nl/ref/fouten/NotFound/",
                "code": "not_found",
                "title": "Niet gevonden.",
                "status": 404,
                "detail": "Niet gevonden.",
                "instance": "urn:uuid:abd3add1-beb8-4d1e-97fd-589b4d797956",
            },
        )

    @Mocker()
    def test_retrieve_zaaktype(self, m):
        user = UserFactory.create(username="test", password="password")
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            json=generate_oas_component(
                "catalogi",
                "schemas/ZaakType",
                url="https://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                informatieobjecttypen=[
                    "https://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111"
                ],
            ),
        )
        m.get(
            "https://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
            json=generate_oas_component(
                "catalogi",
                "schemas/InformatieObjectType",
                url="https://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
                omschrijving="Related IOT",
            ),
        )
        ServiceFactory.create(
            api_type=APITypes.ztc,
            api_root="http://catalogi-api.nl/catalogi/api/v1",
            oas="http://catalogi-api.nl/api/schema/openapi.yaml",
        )

        self.client.force_authenticate(user=user)
        response = self.client.get(
            reverse("api:catalogi:zaaktypen-detail", kwargs={"uuid": "111-111-111"})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertEqual(
            data["url"],
            "https://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
        )
        self.assertEqual(
            data["informatieobjecttypen"][0]["url"],
            "https://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
        )
        self.assertEqual(
            data["informatieobjecttypen"][0]["omschrijving"],
            "Related IOT",
        )


class InformatieobjecttypeViewTests(APITestCase):
    def test_not_authenticated(self):
        iot_url = reverse("api:catalogi:informatieobjecttypen-list")

        response = self.client.get(iot_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    @Mocker()
    def test_retrieve_informatieobjecttypen(self, m):
        user = UserFactory.create(username="test", password="password")
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen",
            json={
                "results": [
                    generate_oas_component(
                        "catalogi",
                        "schemas/InformatieObjectType",
                        url="https://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
                    )
                ]
            },
        )
        ServiceFactory.create(
            api_type=APITypes.ztc,
            api_root="http://catalogi-api.nl/catalogi/api/v1",
            oas="http://catalogi-api.nl/api/schema/openapi.yaml",
        )

        self.client.force_authenticate(user=user)
        response = self.client.get(reverse("api:catalogi:informatieobjecttypen-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertTrue(isinstance(data, list))
        self.assertEqual(
            data[0]["url"],
            "https://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
        )

    @Mocker()
    def test_upstream_raises_error(self, m):
        user = UserFactory.create(username="test", password="password")
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen",
            status_code=404,
            json={
                "type": "http://catalogi-api.nl/ref/fouten/NotFound/",
                "code": "not_found",
                "title": "Niet gevonden.",
                "status": 404,
                "detail": "Niet gevonden.",
                "instance": "urn:uuid:abd3add1-beb8-4d1e-97fd-589b4d797956",
            },
        )
        ServiceFactory.create(
            api_type=APITypes.ztc,
            api_root="http://catalogi-api.nl/catalogi/api/v1",
            oas="http://catalogi-api.nl/api/schema/openapi.yaml",
        )

        self.client.force_authenticate(user=user)
        response = self.client.get(reverse("api:catalogi:informatieobjecttypen-list"))

        self.assertEqual(response.status_code, 404)
        self.assertEqual(
            response.json(),
            {
                "type": "http://catalogi-api.nl/ref/fouten/NotFound/",
                "code": "not_found",
                "title": "Niet gevonden.",
                "status": 404,
                "detail": "Niet gevonden.",
                "instance": "urn:uuid:abd3add1-beb8-4d1e-97fd-589b4d797956",
            },
        )
