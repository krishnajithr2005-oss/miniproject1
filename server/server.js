const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let disasters = [
  { id: 1, type: "Flood", location: "Alappuzha", severity: "High" }
];

app.get("/api/disasters", (req, res) => {
  res.json(disasters);
});

app.post("/api/disasters", (req, res) => {
  const d = { id: disasters.length + 1, ...req.body };
  disasters.push(d);
  res.json(d);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Backend running on port " + PORT);
});
