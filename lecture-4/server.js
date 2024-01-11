const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./userModel");

//constants
const app = express();
const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/jan24TestDb";

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB connect
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Mongodb connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/api/html", (req, res) => {
  return res.send(
    `
          <html>
          <body>
          <h1>This is form<h1/>
          <form action = "/api/form_submit" method="POST">
          <label for="name">Name</label>
          <input type="text" name="name"></input>
          <br/>
          <label for="email">Email</label>
          <input type="text" name="email"></input>
          <br/>
          <label for="password">Password</label>
          <input type="text" name="password"></input>
          <br/>
          <button type='submit'>Submit</button>
          </form>
          <body/>
          <html/>
          `
  );
});

app.post("/api/form_submit", async (req, res) => {
  console.log(req.body);

  const nameC = req.body.name;
  const emailC = req.body.email;
  const passwordC = req.body.password;

  const userObj = new userModel({
    //schema : data (client)
    name: nameC,
    email: emailC,
    password: passwordC,
  });

  console.log(userObj);

  try {
    const userDb = await userObj.save();
    return res.send({
      status: 201,
      message: "user created successfully",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
