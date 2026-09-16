"""Local preview adapter for the exported Wix frontend (not Wix server source)."""
import json
import mimetypes
import subprocess
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
ORIGINAL = 'https://www.thecaravaggio.com'
RECORDS = json.loads((ROOT / 'manifest.json').read_text())
URL_FILES = {r['url']: r['path'] for r in RECORDS if 'path' in r}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        if self.path in ('/', '/index.html'):
            origin = 'http://' + self.headers.get('Host', '127.0.0.1:8766')
            data = (ROOT / 'index.html').read_text().replace(ORIGINAL, origin).replace(ORIGINAL.replace('/', r'\/'), origin.replace('/', r'\/')).encode()
            return self.respond(data, 'text/html; charset=utf-8')
        original_url = ORIGINAL + self.path
        if original_url in URL_FILES:
            p = ROOT / URL_FILES[original_url]
            return self.respond(p.read_bytes(), mimetypes.guess_type(p.name)[0] or 'application/octet-stream')
        if self.path.startswith(('/_api/', '/_serverless/', '/_partials/')):
            result = subprocess.run(['curl', '--globoff', '-sS', '-L', '--fail', '--compressed', '--max-time', '30', original_url], capture_output=True)
            if result.returncode:
                return self.send_error(502, 'Original Wix endpoint unavailable')
            kind = 'application/javascript' if '.js' in urlparse(self.path).path else 'text/css' if 'layoutCss' in self.path else 'application/json'
            return self.respond(result.stdout, kind)
        return super().do_GET()

    def respond(self, data, content_type):
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(data)))
        self.end_headers()
        self.wfile.write(data)

if __name__ == '__main__':
    print('Preview: http://127.0.0.1:8766 (Wix runtime requires internet)')
    ThreadingHTTPServer(('127.0.0.1', 8766), Handler).serve_forever()
