const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Usuarios hardcodeados con roles
const users = {
    admin: { username: 'admin', password: 'admin123', role: 'admin' },
    guide: { username: 'guide', password: 'guide123', role: 'guide' },
    participant: { username: 'participant', password: 'participant123', role: 'participant' },
};

// Simulación de una sesión
let session = null;

// Middleware para validar roles
function authorize(role, res) {
    if (!session || session.role !== role) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden: No tienes acceso a esta pagina');
        return false;
    }
    return true;
}

// Servidor
http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', () => {
            const { username, password } = querystring.parse(body);
            const user = Object.values(users).find(
                u => u.username === username && u.password === password
            );
            if (user) {
                session = { username: user.username, role: user.role }; // Guardamos el usuario logueado
                res.writeHead(302, { Location: `/${user.role}/index.html` });
                res.end();
            } else {
                res.writeHead(302, { Location: '/?error=1' });
                res.end();
            }
        });
    } else if (req.method === 'GET') {
        // Verifica las rutas protegidas
        if (req.url.startsWith('/admin/')) {
            if (!authorize('admin', res)) return;
        } else if (req.url.startsWith('/guide/')) {
            if (!authorize('guide', res)) return;
        } else if (req.url.startsWith('/participant/')) {
            if (!authorize('participant', res)) return;
        }

        // Sirve los archivos estáticos
        const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        const extname = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
        }[extname] || 'text/plain';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('404 Not Found');
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
}).listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});
