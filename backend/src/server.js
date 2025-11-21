const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Socket.io setup for real-time alerts
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  }
});

// Simple placeholder for alert namespace
io.on('connection', (socket) => {
  console.log('Client connected to Socket.io');

  socket.on('disconnect', () => {
    console.log('Client disconnected from Socket.io');
  });
});

// Attach io to app so routes/controllers can use it later
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});


