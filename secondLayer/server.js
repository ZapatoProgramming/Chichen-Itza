import http from 'http';
import fs from 'fs';
import path from 'path';
import { parse as parseQueryString } from 'querystring';
import fetch from 'node-fetch';

// Simulación de una sesión
let session = null;

// Middleware para validar roles
function authorize(role, res) {
    if (!session || session.role !== role) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden: No tienes acceso a esta página');
        return false;
    }
    return true;
}

// Crear el servidor
http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/login') {
        let body = '';
        req.on('data', chunk => (body += chunk.toString()));
        req.on('end', async () => {
            const { username, password } = parseQueryString(body);

            // Hacer la solicitud al servidor Express para verificar credenciales
            try {
                const response = await fetch('http://localhost:3001/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await response.json();

                if (data.success) {
                    session = { username, role: data.user.role }; // Guardamos la sesión
                    res.writeHead(302, { Location: `/${data.user.role}/index.html` });
                    res.end();
                } else {
                    res.writeHead(302, { Location: '/?error=1' });
                    res.end();
                }
            } catch (error) {
                console.error('Error al comunicarse con el servidor de autenticación:', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error interno del servidor');
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
        const filePath = path.join(process.cwd(), req.url === '/' ? 'index.html' : req.url);
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

