"""Folder-move experiment: writes are restricted to a private metadata copy."""
import argparse,json,pathlib,re,sqlite3,os,urllib.parse,urllib.error
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from search_server import authorize,open_archive,search_archive

BASE='/archive-folder-move-test-20261012'
PRODUCTION_DB=pathlib.Path('/opt/myarchive/archive.db')

class MoveError(ValueError):
    def __init__(self,message,status=400):super().__init__(message);self.status=status

def private_database(path):
    path=pathlib.Path(path).resolve()
    if path==PRODUCTION_DB or (path.exists() and PRODUCTION_DB.exists() and os.path.samefile(path,PRODUCTION_DB)):
        raise MoveError('Основная база защищена')
    return path

def move_folder(db,folder_id,parent_id):
    path=private_database(db)
    if type(folder_id) is not int or folder_id<=0:raise MoveError('Некорректная папка')
    if parent_id is not None and (type(parent_id) is not int or parent_id<=0):raise MoveError('Некорректное назначение')
    c=sqlite3.connect(path.as_uri()+'?mode=rw',uri=True,timeout=3)
    try:
        c.execute('BEGIN IMMEDIATE')
        parents=dict(c.execute('SELECT id,parent_id FROM folders'))
        if folder_id not in parents:raise MoveError('Папка не найдена',404)
        if parent_id is not None and parent_id not in parents:raise MoveError('Папка назначения не найдена',404)
        seen=set();cursor=parent_id
        while cursor is not None:
            if cursor==folder_id:raise MoveError('Нельзя переместить папку в себя или в свою подпапку')
            if cursor in seen or cursor not in parents:raise MoveError('Некорректная структура назначения')
            seen.add(cursor);cursor=parents[cursor]
        changed=parents[folder_id]!=parent_id
        if changed:c.execute('UPDATE folders SET parent_id=? WHERE id=?',(parent_id,folder_id))
        c.commit()
        return dict(ok=True,changed=changed,id=folder_id,parent_id=parent_id)
    finally:c.close()

def folder_list(db):
    c=open_archive(private_database(db))
    try:
        rows=[dict(r) for r in c.execute('SELECT id,name,parent_id,media_type FROM folders ORDER BY id')]
        counts={}
        for r in c.execute('SELECT folder_id,file_type,count(*) AS n FROM files GROUP BY folder_id,file_type'):
            counts[(r['folder_id'],r['file_type'])]=r['n']
        covers=dict(c.execute("SELECT folder_id,min(id) FROM files WHERE file_type='photo' GROUP BY folder_id"))
        children={}
        for row in rows:children.setdefault(row['parent_id'],[]).append(row['id'])
        for row in rows:
            pending=[row['id']];seen=set()
            while pending:
                item=pending.pop()
                if item in seen:continue
                seen.add(item);pending.extend(children.get(item,[]))
            row.update(photo_count=sum(counts.get((i,'photo'),0) for i in seen),video_count=sum(counts.get((i,'video'),0) for i in seen),folder_cover_file_id=covers.get(row['id']))
        return rows
    finally:c.close()

def make_handler(db,access_check=authorize):
    private_database(db)
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*args):pass
        def reply(self,status,value):
            data=json.dumps(value,ensure_ascii=False).encode()
            self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
        def do_GET(self):
            parsed=urllib.parse.urlsplit(self.path)
            try:
                if not access_check(self.headers):return self.reply(403,dict(error='Нет доступа'))
                if parsed.path==BASE+'/api/folders':return self.reply(200,folder_list(db))
                if parsed.path==BASE+'/api/search':
                    a=urllib.parse.parse_qs(parsed.query,keep_blank_values=True)
                    return self.reply(200,search_archive(db,a.get('q',[''])[0],limit=int(a.get('limit',['40'])[0]),offset=int(a.get('offset',['0'])[0]),date_from=a.get('from',[''])[0],date_to=a.get('to',[''])[0]))
                self.reply(404,dict(error='Не найдено'))
            except ValueError as e:self.reply(400,dict(error=str(e)))
            except (sqlite3.Error,OSError,urllib.error.URLError):self.reply(503,dict(error='Тестовая версия временно недоступна'))
        def do_PUT(self):
            route=re.fullmatch(re.escape(BASE)+r'/api/folders/(\d+)/move',urllib.parse.urlsplit(self.path).path)
            if not route:return self.reply(404,dict(error='Не найдено'))
            try:
                if not access_check(self.headers):return self.reply(403,dict(error='Нет доступа'))
                length=int(self.headers.get('Content-Length','0'))
                if not 0<length<=4096:raise MoveError('Некорректный запрос')
                data=json.loads(self.rfile.read(length))
                if not isinstance(data,dict) or 'parent_id' not in data:raise MoveError('Укажите место назначения')
                self.reply(200,move_folder(db,int(route.group(1)),data['parent_id']))
            except MoveError as e:self.reply(e.status,dict(error=str(e)))
            except (ValueError,TypeError):self.reply(400,dict(error='Некорректный запрос'))
            except (sqlite3.Error,OSError,urllib.error.URLError):self.reply(503,dict(error='Не удалось переместить папку. Повторите попытку.'))
        def do_POST(self):self.reply(405,dict(error='В этой версии доступен только перенос папок'))
        do_DELETE=do_POST
        do_PATCH=do_POST
    return Handler

if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--db',required=True);p.add_argument('--port',type=int,default=8768);args=p.parse_args()
    ThreadingHTTPServer(('127.0.0.1',args.port),make_handler(args.db)).serve_forever()
