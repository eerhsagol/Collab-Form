const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const formRoutes = require('./routes/formRoutes');
const socketHandler = require('./sockets/socketHandler');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use('/api', formRoutes);

socketHandler(io);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});