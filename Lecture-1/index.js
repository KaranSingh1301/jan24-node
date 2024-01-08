//ES6
// import x from 'x'

//ES5
const express = require("express");

const app = express();

app.get("/home", (req, res) => {
  console.log("Home route hit");
  //method
  console.log(req);
  return res.send("Server is running");
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
