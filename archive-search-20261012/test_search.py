import importlib.util
import pathlib
import sqlite3
import tempfile
import unittest

class SearchTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        path = pathlib.Path(__file__).with_name('search_server.py')
        cls.available = path.exists()
        if cls.available:
            spec = importlib.util.spec_from_file_location('search_server', path)
            cls.module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(cls.module)

    def setUp(self):
        self.assertTrue(self.available, 'Search handler has not been implemented')
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.db = pathlib.Path(self.tmp.name) / 'archive.db'
        with sqlite3.connect(self.db) as c:
            c.executescript('CREATE TABLE folders(id INTEGER PRIMARY KEY,name TEXT,parent_id INTEGER); CREATE TABLE files(id INTEGER PRIMARY KEY,caption TEXT,file_type TEXT,folder_id INTEGER,created_at TEXT,archive_message_id INTEGER);')
            c.executemany('INSERT INTO folders VALUES(?,?,?)', [(1,'Шкатулки',None),(2,'Гаспар',None)])
            c.executemany('INSERT INTO files VALUES(?,?,?,?,?,?)', [(1,'Деревянная ШКАТУЛКА','photo',1,'2026-10-01',10),(2,'Гаспар играет','video',2,'2026-10-02',11),(3,None,'photo',1,'2026-10-03',12),(4,'100%_готово','photo',1,'2026-10-04',13),(5,'Ёлка','photo',1,'2026-10-05',14),(6,'документ','document',1,'2026-10-06',15)])

    def search(self, query, **kwargs):
        return self.module.search_archive(self.db, query, **kwargs)

    def test_cyrillic_substring_case_insensitive(self):
        result = self.search('ШКАТ')
        self.assertEqual([(x['kind'],x['id']) for x in result['items']], [('folder',1),('file',1)])

    def test_empty_query_has_no_results(self):
        self.assertEqual(self.search('  ')['items'], [])

    def test_multiple_words_match_caption_together(self):
        self.assertEqual([x['id'] for x in self.search('шкат ДЕРЕВ')['items']], [1])

    def test_percent_and_underscore_are_literal(self):
        self.assertEqual([x['id'] for x in self.search('%_')['items']], [4])

    def test_quote_is_not_sql(self):
        self.assertEqual(self.search("' OR 1=1 --")['items'], [])

    def test_null_caption_does_not_match_folder_name(self):
        self.assertEqual([x['id'] for x in self.search('Шкат')['items'] if x['kind']=='file'], [1])

    def test_video_result_retains_viewer_metadata(self):
        item = next(x for x in self.search('играет')['items'] if x['kind']=='file')
        self.assertEqual((item['file_type'], item['folder_id'], item['archive_message_id']), ('video',2,11))

    def test_yo_and_e_are_equivalent(self):
        self.assertEqual([x['id'] for x in self.search('елка')['items']], [5])

    def test_pagination_does_not_skip_or_duplicate(self):
        a = self.search('шкат', limit=1)
        b = self.search('шкат', limit=1, offset=a['next_offset'])
        self.assertEqual([(x['kind'],x['id']) for x in a['items']+b['items']], [('folder',1),('file',1)])
        self.assertFalse(b['has_more'])

    def test_connection_cannot_write(self):
        with self.module.open_archive(self.db) as c:
            with self.assertRaises(sqlite3.OperationalError):
                c.execute("UPDATE folders SET name='changed'")

    def test_query_length_is_bounded(self):
        with self.assertRaises(ValueError):
            self.search('a'*201)

    def test_documents_are_not_in_photo_video_search(self):
        self.assertEqual(self.search('документ')['items'], [])

    def test_date_only_search_returns_media_not_folders(self):
        result=self.search('', date_from='2026-10-01', date_to='2026-10-02')
        self.assertEqual([x['id'] for x in result['items']], [2,1])
        self.assertTrue(all(x['kind']=='file' for x in result['items']))

    def test_date_can_narrow_text_search(self):
        self.assertEqual(self.search('шкат',date_from='2026-10-02')['items'], [])

    def test_period_includes_entire_last_day_in_moscow(self):
        with sqlite3.connect(self.db) as c:
            c.executemany('INSERT INTO files VALUES(?,?,?,?,?,?)',[(7,'вечер','photo',1,'2026-10-02 20:59:59',17),(8,'следующий день','photo',1,'2026-10-02 21:00:00',18),(9,'начало','photo',1,'2026-09-30T21:00:00',19),(10,'до начала','photo',1,'2026-09-30 20:59:59',20)])
        ids=[x['id'] for x in self.search('',date_from='2026-10-01',date_to='2026-10-02')['items']]
        self.assertIn(7,ids);self.assertIn(9,ids);self.assertNotIn(8,ids);self.assertNotIn(10,ids)

    def test_date_range_must_not_be_reversed(self):
        with self.assertRaises(ValueError):self.search('',date_from='2026-10-03',date_to='2026-10-01')

    def test_invalid_calendar_date_is_rejected(self):
        with self.assertRaises(ValueError):self.search('',date_from='2026-02-30')

    def test_partial_date_is_rejected(self):
        with self.assertRaises(ValueError):self.search('',date_from='2026-10')

    def test_date_only_pagination_retains_all_results(self):
        a=self.search('',date_from='2026-10-01',date_to='2026-10-02',limit=1)
        b=self.search('',date_from='2026-10-01',date_to='2026-10-02',limit=1,offset=a['next_offset'])
        self.assertEqual([x['id'] for x in a['items']+b['items']], [2,1])

    def test_mixed_timestamp_formats_are_sorted_by_time(self):
        with sqlite3.connect(self.db) as c:
            c.executemany('INSERT INTO files VALUES(?,?,?,?,?,?)',[(7,'порядок','photo',1,'2026-10-02T01:00:00',17),(8,'порядок','photo',1,'2026-10-02 20:00:00',18)])
        self.assertEqual([x['id'] for x in self.search('порядок')['items']], [8,7])

if __name__ == '__main__':
    unittest.main()
