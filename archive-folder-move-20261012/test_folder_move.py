import pathlib,sqlite3,tempfile,unittest,importlib.util

class MoveTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        path=pathlib.Path(__file__).with_name('folder_server.py')
        cls.available=path.exists()
        if cls.available:
            spec=importlib.util.spec_from_file_location('folder_server',path)
            cls.module=importlib.util.module_from_spec(spec);spec.loader.exec_module(cls.module)

    def setUp(self):
        self.assertTrue(self.available,'Folder move is not implemented')
        self.tmp=tempfile.TemporaryDirectory();self.addCleanup(self.tmp.cleanup)
        self.db=pathlib.Path(self.tmp.name)/'copy.db'
        with sqlite3.connect(self.db) as c:
            c.executescript('CREATE TABLE folders(id INTEGER PRIMARY KEY,name TEXT,parent_id INTEGER,media_type TEXT); CREATE TABLE files(id INTEGER PRIMARY KEY,folder_id INTEGER,file_type TEXT,caption TEXT);')
            c.executemany('INSERT INTO folders VALUES(?,?,?,?)',[(1,'Поделки',None,'photo'),(2,'Шкатулки',1,'photo'),(3,'Внутри',2,'photo'),(4,'Гаспар',None,'photo')])
            c.executemany('INSERT INTO files VALUES(?,?,?,?)',[(10,2,'photo','Снимок'),(11,3,'video','Ролик')])

    def move(self,source,target):return self.module.move_folder(self.db,source,target)
    def rows(self,table):
        with sqlite3.connect(self.db) as c:return c.execute('SELECT * FROM '+table+' ORDER BY id').fetchall()

    def test_moves_only_parent_preserving_files_and_descendants(self):
        before=self.rows('files');self.move(2,4)
        self.assertEqual(self.rows('files'),before)
        self.assertEqual(self.rows('folders')[1],(2,'Шкатулки',4,'photo'))
        self.assertEqual(self.rows('folders')[2],(3,'Внутри',2,'photo'))

    def test_can_move_to_root(self):
        self.move(2,None);self.assertIsNone(self.rows('folders')[1][2])

    def test_self_move_is_rejected_without_changes(self):
        before=self.rows('folders')
        with self.assertRaises(ValueError):self.move(2,2)
        self.assertEqual(self.rows('folders'),before)

    def test_descendant_move_is_rejected_without_changes(self):
        before=self.rows('folders')
        with self.assertRaises(ValueError):self.move(1,3)
        self.assertEqual(self.rows('folders'),before)

    def test_missing_destination_is_rejected(self):
        with self.assertRaises(ValueError):self.move(2,999)

    def test_missing_source_is_rejected(self):
        with self.assertRaises(ValueError):self.move(999,4)

    def test_same_parent_is_noop(self):
        self.assertFalse(self.move(2,1)['changed'])

    def test_bool_destination_is_not_folder_id(self):
        with self.assertRaises(ValueError):self.move(2,True)

    def test_destination_ancestry_cycle_is_rejected(self):
        with sqlite3.connect(self.db) as c:c.execute('UPDATE folders SET parent_id=3 WHERE id=1')
        with self.assertRaises(ValueError):self.move(4,3)

    def test_real_database_is_always_protected(self):
        with self.assertRaises(ValueError):self.module.move_folder('/opt/myarchive/archive.db',2,None)

    def test_counts_follow_subtree_after_move(self):
        self.move(2,4);rows={f['id']:f for f in self.module.folder_list(self.db)}
        self.assertEqual((rows[1]['photo_count'],rows[1]['video_count']),(0,0))
        self.assertEqual((rows[4]['photo_count'],rows[4]['video_count']),(1,1))
        self.assertEqual(rows[2]['folder_cover_file_id'],10)

    def test_concurrent_moves_cannot_create_a_cycle(self):
        from concurrent.futures import ThreadPoolExecutor
        def attempt(pair):
            try:self.move(*pair);return True
            except ValueError:return False
        with ThreadPoolExecutor(max_workers=2) as pool:outcomes=list(pool.map(attempt,[(1,4),(4,1)]))
        self.assertEqual(sorted(outcomes),[False,True])

if __name__=='__main__':unittest.main()
