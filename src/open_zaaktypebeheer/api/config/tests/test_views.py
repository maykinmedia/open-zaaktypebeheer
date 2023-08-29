from unittest.mock import patch

from mozilla_django_oidc_db.models import OpenIDConnectConfig
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase


class ConfigurationViewTests(APITestCase):
    def test_configuration_view(self):
        config_url = reverse("api:config:configuration")

        with patch(
            "open_zaaktypebeheer.api.config.views.OpenIDConnectConfig.get_solo",
            return_value=OpenIDConnectConfig(enabled=False),
        ):
            response = self.client.get(config_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.json()["oidcEnabled"])
