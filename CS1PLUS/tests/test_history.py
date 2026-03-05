import unittest
from datetime import date
from pathlib import Path
import tempfile

from birthdate_app.history import init_db, add_entry, list_entries

class TestHistory(unittest.TestCase):
    def test_add_and_list(self):
        with tempfile.TemporaryDirectory() as td:
            db = Path(td) / "h.sqlite3"
            init_db(db)
            rid = add_entry("u1", date(2000,1,1), db_path=db)
            self.assertIsInstance(rid, int)
            entries = list_entries(user="u1", limit=10, db_path=db)
            self.assertEqual(len(entries), 1)
            self.assertEqual(entries[0].birth_date, date(2000,1,1))

if __name__ == "__main__":
    unittest.main()
