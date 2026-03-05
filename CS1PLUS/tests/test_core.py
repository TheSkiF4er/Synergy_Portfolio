import unittest
from datetime import date

from birthdate_app.core import is_leap_year, calculate_age, weekday_ru, render_styled_date, analyze_birthdate

class TestCore(unittest.TestCase):
    def test_leap_year(self):
        self.assertTrue(is_leap_year(2000))
        self.assertFalse(is_leap_year(1900))
        self.assertTrue(is_leap_year(2004))
        self.assertFalse(is_leap_year(2001))

    def test_weekday_ru(self):
        # 2000-01-01 was Saturday
        self.assertEqual(weekday_ru(date(2000,1,1)), "Суббота")

    def test_age(self):
        b = date(2000, 3, 10)
        self.assertEqual(calculate_age(b, today=date(2020,3,9)), 19)
        self.assertEqual(calculate_age(b, today=date(2020,3,10)), 20)

    def test_render(self):
        s = render_styled_date(date(2000,1,1))
        self.assertEqual(len(s.splitlines()), 5)

    def test_analyze(self):
        res = analyze_birthdate(date(2000,1,1), today=date(2020,1,2))
        self.assertEqual(res.age_years, 20)
        self.assertIn("Суббота", res.weekday_ru)

if __name__ == "__main__":
    unittest.main()
