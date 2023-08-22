from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from open_zaaktypebeheer.accounts.tests.factories import UserFactory


class UserMeTest(APITestCase):
    def test_not_authenticated(self):
        me_url = reverse("api:users:me")

        response = self.client.get(me_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_happy_flow(self):
        me_url = reverse("api:users:me")
        user = UserFactory.create(
            username="test",
            password="test",
            email="aaa@aaa.aaa",
            first_name="Jon",
            last_name="Doe",
        )
        self.client.force_authenticate(user=user)

        response = self.client.get(me_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.json(),
            {
                "username": "test",
                "email": "aaa@aaa.aaa",
                "first_name": "Jon",
                "last_name": "Doe",
            },
        )
