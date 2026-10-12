import unittest,tempfile,pathlib,sqlite3,threading,http.client,json
from http.server import ThreadingHTTPServer
from folder_server import make_handler,BASE

class FolderHTTPTests(unittest.TestCase):
    def setUp(self):
        tmp=tempfile.TemporaryDirectory();self.addCleanup(tmp.cleanup)
        self.db=pathlib.Path(tmp.name)/'copy.db'
        with sqlite3.connect(self.db) as c:
            c.executescript('CREATE TABLE folders(id INTEGER PRIMARY KEY,name TEXT,parent_id INTEGER,media_type TEXT); CREATE TABLE files(id INTEGER,folder_id INTEGER,file_type TEXT); INSERT INTO folders VALUES(1,"A",NULL,"photo"),(2,"B",1,"photo"),(3,"C",NULL,"photo");')
    def server(self,allowed=True):
        server=ThreadingHTTPServer(('127.0.0.1',0),make_handler(self.db,lambda headers:allowed))
        threading.Thread(target=server.serve_forever,daemon=True).start()
        self.addCleanup(server.server_close);self.addCleanup(server.shutdown);return server.server_port
    def request(self,port,method,path,body=None):
        c=http.client.HTTPConnection('127.0.0.1',port,timeout=3)
        c.request(method,BASE+path,None if body is None else json.dumps(body),{'Content-Type':'application/json'})
        r=c.getresponse();result=(r.status,json.loads(r.read()));c.close();return result
    def test_move_then_reload_reports_new_parent(self):
        port=self.server();self.assertEqual(self.request(port,'PUT','/api/folders/2/move',{'parent_id':3})[0],200)
        status,rows=self.request(port,'GET','/api/folders');self.assertEqual(status,200);self.assertEqual(next(f for f in rows if f['id']==2)['parent_id'],3)
    def test_denied_request_does_not_move(self):
        self.assertEqual(self.request(self.server(False),'PUT','/api/folders/2/move',{'parent_id':3})[0],403)
        with sqlite3.connect(self.db) as c:self.assertEqual(c.execute('SELECT parent_id FROM folders WHERE id=2').fetchone()[0],1)
    def test_missing_parent_is_not_interpreted_as_root(self):
        self.assertEqual(self.request(self.server(),'PUT','/api/folders/2/move',{})[0],400)
    def test_missing_folder_returns_not_found(self):
        self.assertEqual(self.request(self.server(),'PUT','/api/folders/999/move',{'parent_id':None})[0],404)
    def test_cycle_returns_bad_request(self):
        self.assertEqual(self.request(self.server(),'PUT','/api/folders/1/move',{'parent_id':2})[0],400)
    def test_other_mutations_are_not_supported(self):
        self.assertEqual(self.request(self.server(),'POST','/api/folders',{'name':'X'})[0],405)
        self.assertEqual(self.request(self.server(),'PUT','/api/folders/2',{'name':'X'})[0],404)

if __name__=='__main__':unittest.main()
