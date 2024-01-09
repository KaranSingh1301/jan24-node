const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("Home route hit");
  return res.send("Server is running");
});

app.post("/api", (req, res) => {
  return res.send("Post request");
});

//query
//key=200, key=100,200, key1=100&key2=200

app.get("/api", (req, res) => {
  console.log(req.query);
  const val = req.query.key;
  // console.log(req.query.key.split(","));
  // return res.send(`Query value :${req.query.key} & ${req.query.key2}`);
  return res.send("Get request");
});

//params
app.get("/api/:id", (req, res) => {
  console.log(req.params);
  const val = req.params.id;
  return res.send(val);
  // const val = req.params
});

app.get("/api/:id1/:id2", (req, res) => {
  console.log(req.params);
  // const val = req.params.id;
  return res.send(`${req.params.id1}, ${req.params.id2}`);
  // const val = req.params
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
