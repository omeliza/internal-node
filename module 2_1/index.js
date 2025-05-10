import http from 'node:http';
import sharp from 'sharp';
import formidable, { errors as formidableErrors } from 'formidable';
import path from 'node:path'

const watermark = path.resolve('./watermark.png');
const SIZE = +process.env.SIZE;
const TITLE = process.env.TITLE;
const ADDRESS = process.env.ADDRESS;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.url === '/upload' && req.method === 'POST') {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('Invalid content type');
    }

    const form = formidable({});
    let fields, files;

    try {
      [fields, files] = await form.parse(req);
    } catch (err) {
      if (err.code === formidableErrors.maxFieldsExceeded) {
      }
      console.log(err);
      res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
      res.end(String(err));
      return;
    }
    const uploadedFile = files.image?.[0];

    if (!uploadedFile || !uploadedFile.filepath) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('No file uploaded');
    }
    try {
      const transformedImage = sharp(uploadedFile.filepath)
        .resize(SIZE, SIZE, { fit: 'fill' })
        .png()
        .composite([
          {
            input: watermark,
            gravity: 'southeast',
            opacity: 0.5,
          },
          {
            input: Buffer.from(`
              <svg width="200" height="50">
                <text x="10" y="20" font-size="14" fill="grey" font-weight="bold">${TITLE}</text>
                <text x="10" y="40" font-size="14" fill="grey" font-weight="bold">${ADDRESS}</text>
              </svg>
            `),
            gravity: 'southwest',
          },
        ]);

      const mimeType = 'image/png';
      const fileName = 'transformed-image.png';

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      res.setHeader('X-Image-Dimensions', `${SIZE}x${SIZE}`)

      transformedImage.pipe(res);
    } catch (err) {
      console.error('Error processing the image', err);
      console.error('Error details:', err.stack);
      res.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      res.end('Error processing the image');
    }

    req.on('error', (err) => {
      console.error('Request error:', err);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Error during request');
    });
  }
});
const PORT = process.env.PORT;
server.listen(PORT);

server.on('listening', () => console.log(`Server listening on port: ${PORT}`));
server.on('error', (error) => console.trace(`Server crashed: ${error}`))