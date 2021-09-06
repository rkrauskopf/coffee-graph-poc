const express = require("express");
const { WebSocketServer } = require("ws");
const { parse } = require("url");
const { createServer } = require("http");

// Express setup
const app = express();
const port = process.env.PORT || 3000;

app.use("/web", express.static("public"));

const server = createServer(app);
const wssBrowser = new WebSocketServer({ noServer: true });
const wssBackEnd = new WebSocketServer({ noServer: true });

wssBrowser.on("connection", function connection(ws, req) {
  const userName = req.url.split("=")[1].toLowerCase();
  ws.id = userName;

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  wssBrowser.clients.forEach(function each(client) {
    console.log(client);
    client.send("connected!");
  });
});

wssBackEnd.on("connection", (ws, req) => {
  ws.on("message", (message) => {
    const userName = req.url.split("=")[1].toLowerCase();

    client = wssBrowser.clients.forEach((client) => {
      if (client.id === userName) {
        console.log("message = %s", message);
        client.send(message);
      }
    });
  });
});

wssBackEnd.on("error", (message) => {
  console.log("ws backend error = ", message);
});

server.on("upgrade", function upgrade(request, socket, head) {
  const { pathname } = parse(request.url);

  if (pathname === "/browser") {
    wssBrowser.handleUpgrade(request, socket, head, function done(ws) {
      wssBrowser.emit("connection", ws, request);
    });
  } else if (pathname === "/backend") {
    wssBackEnd.handleUpgrade(request, socket, head, function done(ws) {
      wssBackEnd.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
