const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:8080/backend?userName=kevin");

let seconds = 0;

startMock();

function startMock() {
  ws.on("open", async () => {
    while (seconds < 120) {
      ws.send(
        JSON.stringify({
          time: seconds,
          temp: Math.random() * (seconds + 100 - seconds),
        })
      );

      seconds = seconds + 5;

      await sleep(5000);
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
