const http = require('http');
const app = require('./app');
const port = process.env.PORT || 3000;
const ip = "0.0.0.0";
const server = http.createServer(app);

server.listen(port, ip, () => {
  console.log('Server running on port: ' + port)
});
