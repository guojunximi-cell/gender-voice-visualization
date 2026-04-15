"""
本地 CGI 服务器启动脚本
运行：python serve.py
然后打开浏览器访问 http://localhost:8888
"""
import os, sys, subprocess, socket

# 确保项目目录是工作目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.environ['PYTHONUTF8'] = '1'

from http.server import HTTPServer, SimpleHTTPRequestHandler

PYTHON = sys.executable  # 当前 python.exe 路径

class Handler(SimpleHTTPRequestHandler):

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        try:
            super().do_GET()
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_POST(self):
        # 只处理 .cgi 的 POST 请求
        path = self.path.split('?')[0].lstrip('/')
        if path.endswith('.cgi'):
            self._run_cgi()
        else:
            self.send_error(404)

    def _run_cgi(self):
        script = self.path.split('?')[0].lstrip('/')
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length) if content_length else b''

        env = os.environ.copy()
        env['PYTHONUTF8']     = '1'
        env['REQUEST_METHOD'] = 'POST'
        env['CONTENT_TYPE']   = self.headers.get('Content-Type', '')
        env['CONTENT_LENGTH'] = str(content_length)
        env['QUERY_STRING']   = self.path.split('?', 1)[1] if '?' in self.path else ''
        env['SCRIPT_FILENAME']= os.path.abspath(script)

        result = subprocess.run(
            [PYTHON, script],
            input=body,
            capture_output=True,
            env=env,
            cwd=os.getcwd()
        )

        if result.stderr:
            print('[CGI stderr]', result.stderr.decode('utf-8', errors='replace'))

        output = result.stdout
        # 分离 HTTP 头和正文
        if b'\r\n\r\n' in output:
            raw_headers, body_out = output.split(b'\r\n\r\n', 1)
        elif b'\n\n' in output:
            raw_headers, body_out = output.split(b'\n\n', 1)
        else:
            raw_headers, body_out = b'Content-type: text/plain', output

        self.send_response(200)
        for line in raw_headers.split(b'\n'):
            line = line.strip()
            if b':' in line:
                k, v = line.split(b':', 1)
                self.send_header(k.decode().strip(), v.strip().decode())
        self.end_headers()
        self.wfile.write(body_out)

    def log_message(self, format, *args):
        # 只打印非静态资源的请求，减少噪音
        if not any(self.path.endswith(ext) for ext in ('.png', '.ico', '.svg', '.woff2')):
            super().log_message(format, *args)


def find_free_port(start=8888, end=8999):
    for port in range(start, end):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('', port))
                return port
            except OSError:
                continue
    raise RuntimeError(f"端口 {start}-{end} 全部被占用，请手动释放端口后重试。")


class ReusableHTTPServer(HTTPServer):
    allow_reuse_address = True


env_port = os.environ.get('PORT')
if env_port:
    port = int(env_port)
    bind_host = '0.0.0.0'
    print(f"启动成功！监听 {bind_host}:{port}")
else:
    port = find_free_port()
    bind_host = ''
    print(f"启动成功！请打开浏览器访问：http://localhost:{port}")
print("按 Ctrl+C 停止服务器")
ReusableHTTPServer((bind_host, port), Handler).serve_forever()
