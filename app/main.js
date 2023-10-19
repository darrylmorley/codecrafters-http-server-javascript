const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    let path = data.toString().split(" ");

    if (path[1] === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (path[1].startsWith("/echo/")) {
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${
          path[1].slice(6).length
        }\r\n\r\n${path[1].slice(6)}`
      );
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
