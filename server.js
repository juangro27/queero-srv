const app = require("./app");
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";
const PORT = process.env.PORT || 5005;

const io = require('socket.io')(server, {
  cors: {
    origin: [FRONTEND_URL],
  }
});


io.on('connect', function (socket) {

  console.log(`A user connected (${io.engine.clientsCount} users online)`);

  socket.on('chat message', () => {

    io.emit('chat message');

  });

  socket.on('disconnect', function () {

    console.log(`A user disconnected (${io.engine.clientsCount} users online)`);

  });

  socket.on('connect_error', function (error) {

    console.log('Socket connection error:', error);

  });
});



server.listen(PORT, () => {

  console.log(`Server listening on http://localhost:${PORT}`);

});
