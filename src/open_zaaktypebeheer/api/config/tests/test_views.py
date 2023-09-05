from unittest.mock import patch

from mozilla_django_oidc_db.models import OpenIDConnectConfig
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from open_zaaktypebeheer.accounts.tests.factories import UserFactory


class ConfigurationViewTests(APITestCase):
    def test_configuration_view(self):
        config_url = reverse("api:config:configuration")

        with patch(
            "open_zaaktypebeheer.api.config.serializers.OpenIDConnectConfig.get_solo",
            return_value=OpenIDConnectConfig(enabled=False),
        ):
            response = self.client.get(config_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.json()["oidcEnabled"])

    def test_public_fields(self):
        config_url = reverse("api:config:configuration")

        with self.subTest("Not authenticated"):
            response = self.client.get(config_url)

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            data = response.json()

            self.assertNotIn("openzaakAdminUrl", data)

        user = UserFactory.create()
        self.client.force_authenticate(user=user)

        with self.subTest("Authenticated"):
            response = self.client.get(config_url)

            self.assertEqual(response.status_code, status.HTTP_200_OK)

            data = response.json()

            self.assertIn("openzaakAdminUrl", data)
