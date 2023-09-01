from django.test import override_settings

from requests_mock import Mocker
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase
from zgw_consumers.constants import APITypes
from zgw_consumers.test.component_generation import generate_oas_component
from zgw_consumers.test.schema_mock import mock_service_oas_get

from open_zaaktypebeheer.accounts.tests.factories import UserFactory

from ..constants import OperationStatus
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
                        url="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
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
            "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
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
                url="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                informatieobjecttypen=[
                    "http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111"
                ],
            ),
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
            json=generate_oas_component(
                "catalogi",
                "schemas/InformatieObjectType",
                url="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
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
            "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
        )
        self.assertEqual(
            data["informatieobjecttypen"][0]["url"],
            "http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
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
                        url="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
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
            "http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
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


@Mocker()
class ZaaktypeInformatieobjecttypeRelationTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()

        cls.user = UserFactory.create(username="test", password="password")
        cls.serivce = ServiceFactory.create(
            api_type=APITypes.ztc,
            api_root="http://catalogi-api.nl/catalogi/api/v1",
            oas="http://catalogi-api.nl/api/schema/openapi.yaml",
        )

    def test_not_authenticated(self, m):
        relation_url = reverse("api:catalogi:zaaktype-informatieobjecttypen")

        response = self.client.post(relation_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_deleting_all_relations(self, m):
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen?zaaktype=http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111&status=concept",
            json={
                "results": [
                    generate_oas_component(
                        "catalogi",
                        "schemas/ZaakTypeInformatieObjectType",
                        url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
                        zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                        informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
                        volgnummer=1,
                    ),
                    generate_oas_component(
                        "catalogi",
                        "schemas/ZaakTypeInformatieObjectType",
                        url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
                        zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                        informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/222-222-222",
                        volgnummer=2,
                    ),
                ]
            },
        )
        m.delete(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            status_code=204,
        )
        m.delete(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
            status_code=204,
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("api:catalogi:zaaktype-informatieobjecttypen"),
            {
                "zaaktype_url": "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                "relations": [],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()
        urls_called_last = [mocked_call.url for mocked_call in m.request_history[-2:]]

        self.assertEqual(data["status"], OperationStatus.succeeded)
        self.assertEqual(0, len(data["failures"]))
        self.assertIn(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            urls_called_last,
        )
        self.assertIn(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
            urls_called_last,
        )

    def test_update_relations_only_if_changed(self, m):
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )

        relation_1 = generate_oas_component(
            "catalogi",
            "schemas/ZaakTypeInformatieObjectType",
            url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
            volgnummer=1,
            richting="intern",
        )
        relation_2 = generate_oas_component(
            "catalogi",
            "schemas/ZaakTypeInformatieObjectType",
            url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
            zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/222-222-222",
            volgnummer=2,
            richting="uitgaand",
        )
        updated_relation_2 = {**relation_2, **{"volgnummer": 3, "richting": "intern"}}

        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen?zaaktype=http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111&status=concept",
            json={"results": [relation_1, relation_2]},
        )
        m.patch(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
            json=updated_relation_2,
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("api:catalogi:zaaktype-informatieobjecttypen"),
            {
                "zaaktype_url": "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                "relations": [
                    relation_1,
                    updated_relation_2,
                ],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertEqual(data["status"], OperationStatus.succeeded)
        self.assertEqual(0, len(data["failures"]))
        self.assertEqual(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
            m.request_history[-1].url,
        )

    def test_create_update_delete_relations(self, m):
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        relation_1 = generate_oas_component(
            "catalogi",
            "schemas/ZaakTypeInformatieObjectType",
            url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
            volgnummer=1,
            richting="intern",
        )
        relation_2 = generate_oas_component(
            "catalogi",
            "schemas/ZaakTypeInformatieObjectType",
            url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
            zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/222-222-222",
            volgnummer=2,
            richting="uitgaand",
        )
        updated_relation_2 = {**relation_2, **{"volgnummer": 3, "richting": "intern"}}
        relation_3 = generate_oas_component(
            "catalogi",
            "schemas/ZaakTypeInformatieObjectType",
            zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/333-333-333",
            volgnummer=3,
            richting="inkomend",
        )
        del relation_3["url"]  # A new relation does not have a URL yet

        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen?zaaktype=http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111&status=concept",
            json={"results": [relation_1, relation_2]},
        )
        m.delete(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            status_code=204,
        )
        m.post(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen",
            json={
                **relation_3,
                "url": "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/333-333-333",
            },
            status_code=201,
        )
        m.patch(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
            json=updated_relation_2,
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("api:catalogi:zaaktype-informatieobjecttypen"),
            {
                "zaaktype_url": "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                "relations": [updated_relation_2, relation_3],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertEqual(0, len(data["failures"]))
        self.assertEqual(data["status"], OperationStatus.succeeded)

        history_urls = [item.url for item in m.request_history]

        self.assertIn(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            history_urls,
        )
        self.assertIn(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen",
            history_urls,
        )
        self.assertIn(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/222-222-222",
            history_urls,
        )

    def test_deleting_relation_returns_error(self, m):
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen?zaaktype=http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111&status=concept",
            json={
                "results": [
                    generate_oas_component(
                        "catalogi",
                        "schemas/ZaakTypeInformatieObjectType",
                        url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
                        zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                        informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
                        volgnummer=1,
                    ),
                ]
            },
        )
        m.delete(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            status_code=400,
            json={
                "type": "Error",
                "code": "400",
                "title": "Error",
                "status": 400,
                "detail": "An error occurred.",
                "instance": "Error",
            },
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("api:catalogi:zaaktype-informatieobjecttypen"),
            {
                "zaaktype_url": "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                "relations": [],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertEqual(data["status"], OperationStatus.failed)
        self.assertEqual(len(data["failures"]), 1)
        self.assertEqual(
            data["failures"][0]["extra"]["url"],
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
        )
        self.assertEqual(
            data["failures"][0]["errors"],
            [
                {
                    "type": "Error",
                    "code": "400",
                    "title": "Error",
                    "status": 400,
                    "detail": "An error occurred.",
                    "instance": "Error",
                }
            ],
        )

    def test_updating_relation_returns_error(self, m):
        relation = generate_oas_component(
            "catalogi",
            "schemas/ZaakTypeInformatieObjectType",
            url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
            volgnummer=1,
        )
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen?zaaktype=http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111&status=concept",
            json={"results": [relation]},
        )
        m.patch(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            status_code=400,
            json={
                "type": "Error",
                "code": "400",
                "title": "Error",
                "status": 400,
                "detail": "An error occurred.",
                "instance": "Error",
            },
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("api:catalogi:zaaktype-informatieobjecttypen"),
            {
                "zaaktype_url": "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                "relations": [{**relation, "volgnummer": 2}],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertEqual(data["status"], OperationStatus.failed)
        self.assertEqual(len(data["failures"]), 1)
        self.assertEqual(
            data["failures"][0]["extra"]["url"],
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
        )
        self.assertEqual(
            data["failures"][0]["errors"],
            [
                {
                    "type": "Error",
                    "code": "400",
                    "title": "Error",
                    "status": 400,
                    "detail": "An error occurred.",
                    "instance": "Error",
                }
            ],
        )

    def test_creating_relation_returns_error(self, m):
        relation = generate_oas_component(
            "catalogi",
            "schemas/ZaakTypeInformatieObjectType",
            zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
            volgnummer=1,
        )
        del relation["url"]  # A relation to create has no URL
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen?zaaktype=http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111&status=concept",
            json={"results": []},
        )
        m.post(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen",
            status_code=400,
            json={
                "type": "Error",
                "code": "400",
                "title": "Error",
                "status": 400,
                "detail": "An error occurred.",
                "instance": "Error",
            },
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("api:catalogi:zaaktype-informatieobjecttypen"),
            {
                "zaaktype_url": "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                "relations": [relation],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.json()

        self.assertEqual(len(data["failures"]), 1)
        self.assertEqual(data["status"], OperationStatus.failed)
        self.assertEqual(
            data["failures"][0]["extra"]["informatieobjecttype"],
            "http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
        )
        self.assertEqual(
            data["failures"][0]["extra"]["zaaktype"],
            "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
        )
        self.assertEqual(
            data["failures"][0]["errors"],
            [
                {
                    "type": "Error",
                    "code": "400",
                    "title": "Error",
                    "status": 400,
                    "detail": "An error occurred.",
                    "instance": "Error",
                }
            ],
        )

    def test_retrieving_relation_raises_error(self, m):
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        m.get(
            "http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen?zaaktype=http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111&status=concept",
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

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("api:catalogi:zaaktype-informatieobjecttypen"),
            {
                "zaaktype_url": "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
                "relations": [],
            },
            format="json",
        )

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

    @override_settings(LANGUAGE_CODE="en")
    def test_mismatched_zaaktype_urls(self, m):
        mock_service_oas_get(
            m,
            url="http://catalogi-api.nl/",
            oas_url="http://catalogi-api.nl/api/schema/openapi.yaml",
            service="catalogi",
        )
        relation = generate_oas_component(
            "catalogi",
            "schemas/ZaakTypeInformatieObjectType",
            url="http://catalogi-api.nl/catalogi/api/v1/zaaktype-informatieobjecttypen/111-111-111",
            zaaktype="http://catalogi-api.nl/catalogi/api/v1/zaaktypen/111-111-111",
            informatieobjecttype="http://catalogi-api.nl/catalogi/api/v1/informatieobjecttypen/111-111-111",
            volgnummer=1,
        )

        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse("api:catalogi:zaaktype-informatieobjecttypen"),
            {
                "zaaktype_url": "http://catalogi-api.nl/catalogi/api/v1/zaaktypen/DIFFERENT-UUID",
                "relations": [relation],
            },
            format="json",
        )

        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual(
            response.json()["nonFieldErrors"][0],
            "The URL of the zaaktype inside each relation needs to match the URL in the zaaktype_url param",
        )
