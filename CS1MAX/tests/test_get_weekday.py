import unittest

from birthdate_app.core import get_weekday

class TestGetWeekday(unittest.TestCase):
    def test_get_weekday_ru(self):
        # 2000-01-01 was Saturday
        self.assertEqual(get_weekday(1,1,2000,lang='ru'), "Суббота")

    def test_get_weekday_en(self):
        self.assertEqual(get_weekday(1,1,2000,lang='en'), "Saturday")

    def test_bad_ranges(self):
        with self.assertRaises(ValueError):
            get_weekday(0,1,2000)
        with self.assertRaises(ValueError):
            get_weekday(1,13,2000)

if __name__ == "__main__":
    unittest.main()
