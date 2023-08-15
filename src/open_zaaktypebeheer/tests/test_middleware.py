from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from ..middleware import CSRF_TOKEN_HEADER_NAME


class CSRFTokenMiddleware(APITestCase):
    def test_csrftoken_in_header_api_endpoint(self):
        url = reverse("api:api-docs")

        response = self.client.get(url)

        self.assertIn(CSRF_TOKEN_HEADER_NAME, response.headers)

    def test_csrftoken_not_in_header_root(self):
        response = self.client.get("/")

        self.assertNotIn(CSRF_TOKEN_HEADER_NAME, response.headers)

    def test_csrftoken_in_header_api_endpoint_with_subpath(self):
        url = reverse("api:api-docs")

        response = self.client.get(url, SCRIPT_NAME="/subpath")

        self.assertIn(CSRF_TOKEN_HEADER_NAME, response.headers)

    def test_csrftoken_not_in_header_root_with_subpath(self):
        response = self.client.get("/", SCRIPT_NAME="/subpath")

        self.assertNotIn(CSRF_TOKEN_HEADER_NAME, response.headers)
