// const dataArray = [
//   { time: 1, temp: 1 },
//   { time: 2, temp: 2 },
//   { time: 3, temp: 3 },
// ];

const dataArray = [];

const userInput = document.getElementById("user-name");
const userName = localStorage.getItem("userName");
userInput.value = userName;

const connectBtn = document.getElementById("connect");
const connectionStatus = document.getElementById("connection-status");

// const labels = dataArray.map((data) => data.time);
// const data = dataArray.map((data) => data.temp);
const chartConfig = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        label: "Test Data Set",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
      },
    ],
  },
  options: {
    scales: {
      x: {
        display: true,
      },
    },
  },
};

const myChart = new Chart(document.getElementById("my-chart"), chartConfig);

connectBtn.onclick = () => {
  const userName = userInput.value;
  const socket = new WebSocket(
    `wss://coffee-roasting.herokuapp.com/browser?userName=${userName}`
  );

  localStorage.setItem("userName", userName);
  // Connection opened
  socket.addEventListener("open", function (event) {
    connectionStatus.innerText = "Connected!";
  });

  // Listen for messages
  socket.addEventListener("message", async function (event) {
    if (event.data.text) {
      const decodedString = await event.data.text();
      const jsonData = JSON.parse(decodedString);
      console.log("Message from server ", jsonData);
      dataArray.push(jsonData);

      myChart.data.labels.push(jsonData.time);
      myChart.data.datasets[0].data.push(jsonData.temp);
      myChart.update();
    } else {
      console.log("Message from server ", event.data);
    }
  });
};
