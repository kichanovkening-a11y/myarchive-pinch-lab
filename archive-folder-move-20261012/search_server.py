"""Isolated search experiment. SQLite is opened read-only; no media is saved."""
import argparse
import json
import pathlib
import sqlite3
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import date
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROUTE = '/archive-search-test-20261012/api/search'

def normalize(value):
    return unicodedata.normalize('NFKC', value or '').casefold().replace('ё', 'е')

def open_archive(path):
    connection = sqlite3.connect(pathlib.Path(path).resolve().as_uri() + '?mode=ro', uri=True, timeout=3)
    connection.row_factory = sqlite3.Row
    connection.execute('PRAGMA query_only=ON')
    connection.create_function('search_text', 1, normalize, deterministic=True)
    return connection

def calendar_date(value):
    if not value:
        return ''
    parsed = date.fromisoformat(value)
    if parsed.isoformat() != value:
        raise ValueError('Укажите дату в формате ГГГГ-ММ-ДД')
    return value

def search_archive(path, query, limit=40, offset=0, date_from='', date_to=''):
    query = query.strip()
    if len(query) > 200:
        raise ValueError('Не более 200 символов')
    limit = max(1, min(int(limit), 40))
    offset = max(0, int(offset))
    date_from, date_to = calendar_date(date_from), calendar_date(date_to)
    dated = bool(date_from or date_to)
    if date_from and date_to and date_from > date_to:
        raise ValueError('Дата «С» должна быть не позже даты «По»')
    if not query and not dated:
        return dict(items=[], total=0, has_more=False, next_offset=None)
    tokens = normalize(query).split()
    folder_where = ' AND '.join('instr(search_text(name), ?) > 0' for _ in tokens) if not dated else '0'
    file_terms = ["file_type IN ('photo','video')"] + ['instr(search_text(caption), ?) > 0' for _ in tokens]
    file_params = list(tokens)
    if date_from:
        file_terms.append("date(created_at, '+3 hours') >= ?")
        file_params.append(date_from)
    if date_to:
        file_terms.append("date(created_at, '+3 hours') <= ?")
        file_params.append(date_to)
    file_where = ' AND '.join(file_terms)
    folder_params = tokens if not dated else []
    c = open_archive(path)
    try:
        # Keep counts and both result groups in the same read snapshot.
        c.execute('BEGIN')
        nf = c.execute('SELECT COUNT(*) FROM folders WHERE ' + folder_where, folder_params).fetchone()[0]
        nm = c.execute('SELECT COUNT(*) FROM files WHERE ' + file_where, file_params).fetchone()[0]
        result = []
        if offset < nf:
            rows = c.execute('SELECT id,name,parent_id FROM folders WHERE ' + folder_where + ' ORDER BY search_text(name),id LIMIT ? OFFSET ?', [*folder_params,limit,offset]).fetchall()
            result.extend(dict(row, kind='folder') for row in rows)
        remaining = limit - len(result)
        if remaining:
            rows = c.execute('SELECT id,caption,file_type,folder_id,created_at,archive_message_id FROM files WHERE ' + file_where + ' ORDER BY datetime(created_at) DESC,id DESC LIMIT ? OFFSET ?', [*file_params,remaining,max(0,offset-nf)]).fetchall()
            result.extend(dict(row, kind='file') for row in rows)
        more = offset + len(result) < nf + nm
        return dict(items=result, total=nf+nm, has_more=more, next_offset=offset+len(result) if more else None)
    finally:
        c.close()

def authorize(headers):
    # Reuse the production access check without importing/running its application.
    forwarded = {}
    if headers.get('X-Telegram-Init-Data'):
        forwarded['X-Telegram-Init-Data'] = headers['X-Telegram-Init-Data']
    request = urllib.request.Request('http://127.0.0.1:5000/api/folders', headers=forwarded)
    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            return response.status == 200
    except urllib.error.HTTPError as error:
        if error.code == 403:
            return False
        raise

def make_handler(db_path, access_check=authorize):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, format, *args):
            # Do not write user search text / Telegram headers to experiment logs.
            pass

        def reply(self, status, value):
            data = json.dumps(value, ensure_ascii=False).encode('utf-8')
            self.send_response(status)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def do_GET(self):
            parsed = urllib.parse.urlsplit(self.path)
            if parsed.path != ROUTE:
                return self.reply(404, dict(error='Не найдено'))
            try:
                if not access_check(self.headers):
                    return self.reply(403, dict(error='Нет доступа'))
                args = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
                result = search_archive(db_path, args.get('q',[''])[0], limit=int(args.get('limit',['40'])[0]), offset=int(args.get('offset',['0'])[0]), date_from=args.get('from',[''])[0], date_to=args.get('to',[''])[0])
                self.reply(200, result)
            except (ValueError, TypeError):
                self.reply(400, dict(error='Проверьте текст поиска и даты периода. Дата «С» должна быть не позже даты «По».'))
            except (sqlite3.Error, OSError, urllib.error.URLError):
                self.reply(503, dict(error='Поиск временно недоступен. Повторите попытку.'))

        def do_POST(self):
            self.reply(405, dict(error='Только чтение'))
        do_PUT = do_POST
        do_DELETE = do_POST
        do_PATCH = do_POST
    return Handler

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--db', default='/opt/myarchive/archive.db')
    parser.add_argument('--port', type=int, default=8767)
    args = parser.parse_args()
    ThreadingHTTPServer(('127.0.0.1',args.port), make_handler(args.db)).serve_forever()
