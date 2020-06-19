const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const ip = "0.0.0.0";
const server = http.createServer(app);

server.on('connection', function (sock) {
  console.log(sock.remoteAddress);
  // Put your logic for what to do next based on that remote address here
});

server.listen(port, () => {
  console.log('Server running on port: ' + port)
});
