const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "Welcome to InnerLandscape95" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`InnerLandscape95 server running on port ${PORT}`);
});