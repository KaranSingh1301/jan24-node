const express = require("express");
const clc = require("cli-color");
require("dotenv").config();

//file-imports
require("./db");
const AuthRouter = require("./Controllers/AuthController");

//const
const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "Server is up and running",
  });
});

app.use(express.json());
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(
    clc.yellowBright.underline(`Blogging server is running PORT: ${PORT}`)
  );
});
