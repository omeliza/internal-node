const http = require('http');
const crypto = require('crypto');

const server = http.createServer((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  if (req.url === '/random/uuid' && req.method ==='GET') {
    const uuid = crypto.randomUUID();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'content-type': 'application/json'});
    res.end(JSON.stringify({ uuid }));
  } if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ message: 'Hello from node server'}));
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
/**
 * Create simple frontend+backend project that runs by docker.

// 1. A frontend project should be in a client folder. The client should serve 
// a simple main page under / and 404 page for all other routes. The main page 
// should make GET /random/uuid request to server and display result, also contain refresh button.

// 2. A backend project in server folder. Server should handle GET /random/uuid 
// requests, the response is random uuid(from crypto library)

// 3. In client should be a production Dockerfile for frontend, Dockerfile should 
// be multistaged and not include building artifacts. Resulting image should be based 
// on nginx alpine image with only static files added. Nginx sould be configured to serve 
// main and 404 pages. Nginx sould be configured to cache, compress responses.

// 4. In server should be a production Dockerfile for backend, Dockerfile should be 
// multistaged and not include building artifacts. Resulting image should be based on node alpine image.

// 5. In root directory should be a docker-compose file in root directory, 
// docker-compose should contain 2 services for backend and frontend, backend port 
// should not be exposed to host

// 6. All application should build and start with docker-compose up command in root directory

// 7. Backend should start before frontend

8. If either frontend or backend fails, containers should be automatically restarted

9. If backend is not reachable, frontend should show a message "Backend is not reachable"
 */