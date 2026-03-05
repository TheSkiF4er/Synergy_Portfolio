from django.test import TestCase
from django.urls import reverse

from .models import Greeting


class GreetingAppTests(TestCase):
    def test_home_page_loads(self):
        resp = self.client.get(reverse("index"))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "Say hello")

    def test_valid_name_creates_record_and_redirects(self):
        resp = self.client.post(reverse("index"), {"name": "Alice"})
        # PRG redirect
        self.assertEqual(resp.status_code, 302)
        self.assertEqual(Greeting.objects.count(), 1)
        self.assertEqual(Greeting.objects.first().name, "Alice")

        # Follow redirect and check message is displayed
        resp2 = self.client.get(reverse("index"))
        self.assertEqual(resp2.status_code, 200)

    def test_empty_name_shows_error(self):
        resp = self.client.post(reverse("index"), {"name": "   "})
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "Please fix the errors below.")
        self.assertEqual(Greeting.objects.count(), 0)

    def test_history_page_lists_items(self):
        Greeting.objects.create(name="Bob")
        resp = self.client.get(reverse("history"))
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "Bob")

    def test_api_returns_json(self):
        Greeting.objects.create(name="Eve")
        resp = self.client.get(reverse("api_greetings"))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp["Content-Type"], "application/json")
        data = resp.json()
        self.assertEqual(data["count"], 1)
        self.assertEqual(data["items"][0]["name"], "Eve")
