const net = require("net");
const fs = require("fs");

const dirFlag = process.argv.indexOf("--directory");
const dir = dirFlag > 1 && process.argv[process.argv.indexOf("--directory") + 1];

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    let path = data.toString().split(" ");
    let agent = data.toString().split("\r\n")[2];

    if (path[1] === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } else if (path[1].startsWith("/echo/")) {
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${
          path[1].slice(6).length
        }\r\n\r\n${path[1].slice(6)}`
      );
    } else if (path[1] === "/user-agent") {
      socket.write(
        `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${
          agent.slice(12).length
        }\r\n\r\n${agent.slice(12)}`
      );
    } else if (path[1].startsWith("/files/")) {
      let fileName = path[1].slice(7);
      let filePath = `${dir}${fileName}`;

      if (fs.existsSync(filePath)) {
        let data = fs.readFileSync(filePath, "utf-8");

        socket.write(
          `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${data.length}\r\n\r\n${data}`
        );
      } else {
        socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      }
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }

    socket.end();
  });

  socket.on("close", () => {
    socket.end();
    // server.close();
  });
});

server.listen(4221, "localhost");
