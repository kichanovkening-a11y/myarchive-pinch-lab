import http.client
import threading
import unittest
from urllib.parse import quote
from http.server import ThreadingHTTPServer
from search_server import make_handler, ROUTE

class HTTPTests(unittest.TestCase):
    def start(self, check):
        server=ThreadingHTTPServer(('127.0.0.1',0),make_handler('/does/not/exist',check))
        thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
        self.addCleanup(server.server_close);self.addCleanup(server.shutdown)
        return server.server_port

    def request(self,port,method,path=ROUTE):
        c=http.client.HTTPConnection('127.0.0.1',port,timeout=3)
        c.request(method,path);response=c.getresponse();status=response.status;response.read();c.close();return status

    def test_denied_access_does_not_read_database(self):
        self.assertEqual(self.request(self.start(lambda headers:False),'GET'),403)

    def test_write_requests_are_rejected(self):
        port=self.start(lambda headers:True)
        for method in ('POST','PUT','DELETE','PATCH'):
            self.assertEqual(self.request(port,method),405)

    def test_other_routes_are_not_served(self):
        self.assertEqual(self.request(self.start(lambda headers:True),'GET','/api/folders'),404)

    def test_missing_database_reports_unavailable(self):
        self.assertEqual(self.request(self.start(lambda headers:True),'GET',ROUTE+'?q='+quote('шка')),503)

    def test_invalid_offset_is_bad_request(self):
        self.assertEqual(self.request(self.start(lambda headers:True),'GET',ROUTE+'?offset=oops'),400)

if __name__=='__main__':unittest.main()
