import unittest
from datetime import date

from birthdate_app.validation import validate_birthdate, BirthdateValidationError, ValidationPolicy

class TestValidation(unittest.TestCase):
    def test_invalid_date(self):
        with self.assertRaises(BirthdateValidationError):
            validate_birthdate(31, 2, 2000)

    def test_future_date_disallowed(self):
        policy = ValidationPolicy(allow_future_dates=False)
        future = date.today().replace(year=date.today().year + 1)
        with self.assertRaises(BirthdateValidationError):
            validate_birthdate(future.day, future.month, future.year, policy=policy)

    def test_year_bounds(self):
        with self.assertRaises(BirthdateValidationError):
            validate_birthdate(1, 1, 1800)

if __name__ == "__main__":
    unittest.main()
