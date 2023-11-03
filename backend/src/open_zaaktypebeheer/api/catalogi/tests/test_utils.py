from django.test import TestCase

import freezegun

from ..utils import add_active_information


class UtilsFunctionsTests(TestCase):
    def test_add_active_information(self):
        test_zaaktypen = [
            # Active
            {"beginGeldigheid": "2023-01-01", "eindeGeldigheid": "2023-12-31"},
            {"beginGeldigheid": "2023-01-01"},
            # Not active, was active in the past
            {"beginGeldigheid": "2022-01-01", "eindeGeldigheid": "2022-12-31"},
            # Not active, will be active in the future
            {"beginGeldigheid": "2024-01-01", "eindeGeldigheid": "2024-12-31"},
        ]

        with freezegun.freeze_time("2023-02-01"):
            processed_zaaktypen = add_active_information(test_zaaktypen)

        self.assertTrue(processed_zaaktypen[0]["actief"])
        self.assertTrue(processed_zaaktypen[1]["actief"])
        self.assertFalse(processed_zaaktypen[2]["actief"])
        self.assertFalse(processed_zaaktypen[3]["actief"])
