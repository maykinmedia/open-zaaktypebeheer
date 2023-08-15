from django.test import override_settings

from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from open_zaaktypebeheer.accounts.tests.factories import UserFactory


@override_settings(LANGUAGE_CODE="en")
class LoginTests(APITestCase):
    def test_no_credentials_given(self):
        login_url = reverse("api:authentication:login")

        response = self.client.post(login_url, data={})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()["username"][0], "This field is required.")
        self.assertEqual(response.json()["password"][0], "This field is required.")

    def test_wrong_credentials_given(self):
        login_url = reverse("api:authentication:login")

        response = self.client.post(
            login_url, data={"username": "bla", "password": "bla"}
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.json()["non_field_errors"][0],
            "Unable to log in with provided credentials.",
        )

    def test_happy_flow(self):
        login_url = reverse("api:authentication:login")
        UserFactory.create(username="test", password="password")

        response = self.client.post(
            login_url, data={"username": "test", "password": "password"}
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIn("open_zaaktypebeheer_sessionid", response.cookies)
