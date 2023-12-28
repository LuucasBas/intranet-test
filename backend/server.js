const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

const imageDir = "//192.168.130.62/TempImageFiles";
const staticImagePath = "/image";
const watcher = chokidar.watch(imageDir, { persistent: true, usePolling: true });

app.use(express.static(path.join(__dirname, 'public')));

app.use(staticImagePath, express.static(imageDir));


const corsOptions = {
  origin: 'http://localhost:5173', // Cambiado a la URL donde se ejecutará tu aplicación React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Habilita CORS para todas las rutas
app.use(cors(corsOptions));

const isImageFile = (file) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext);
};

const updateLatestImage = () => {
  const files = fs.readdirSync(imageDir);
  let latestImage = null;
  let latestModifiedDate = 0;

  files.forEach((file) => {
    const filePath = path.join(imageDir, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile() && stats.mtimeMs > latestModifiedDate && isImageFile(file)) {
      latestModifiedDate = stats.mtimeMs;
      latestImage = file;
    }
  });

  // Construye la ruta relativa para el cliente
  return latestImage ? `${staticImagePath}/${latestImage}` : null;
};


const sendLatestImage = () => {
  const imagePath = updateLatestImage();
  if (imagePath) {
    io.emit('updateLatestImage', imagePath);
  }
};

app.get('/latest-image', (req, res) => {
  const imagePath = updateLatestImage();
  if (imagePath) {
    res.send(imagePath);
  } else {
    res.status(404).send('Imagen no encontrada');
  }
});

watcher.on('change', sendLatestImage);

io.on('connection', (socket) => {
  // Enviar la última imagen cuando se recibe el evento 'getLatestImage'
  socket.on('getLatestImage', sendLatestImage);

  // También enviar la última imagen inmediatamente después de la conexión
  sendLatestImage();
});


server.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
