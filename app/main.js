const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    let path = data.toString().split(" ");

    if (path[1] === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }

    socket.end();
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");
