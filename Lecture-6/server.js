const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");

//file-imports
const { cleanupAndValidate } = require("./utils/authUtils");
const userModel = require("./models/userModel");

//constants
const app = express();
const PORT = process.env.PORT || 8000;

//middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//DB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(clc.yellowBright("MongoDb connected successfully"));
  })
  .catch((err) => {
    console.log(clc.redBright(err));
  });

//api
app.get("/", (req, res) => {
  return res.send("Server is running");
});

app.get("/register", (req, res) => {
  return res.render("register");
});

app.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;
  //data validation

  try {
    await cleanupAndValidate({ name, email, username, password });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data error",
      error: error,
    });
  }

  //email and usernames are unique
  const userEmailsExist = await userModel.findOne({ email: email });

  if (userEmailsExist) {
    return res.send({
      status: 400,
      message: "Email already exist",
    });
  }

  const userUsernameExist = await userModel.findOne({ username });
  if (userUsernameExist) {
    return res.send({
      status: 400,
      message: "Username already exist",
    });
  }

  //store data in DB
  const userObj = new userModel({
    //schema key : value
    name: name,
    email: email,
    username: username,
    password: password,
  });

  try {
    const userDb = await userObj.save();

    return res.send({
      status: 201,
      message: "user created, registeration successfull!",
      data: userDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Data base error",
      error: error,
    });
  }
});

app.get("/login", (req, res) => {
  return res.render("login");
});

app.post("/login", (req, res) => {
  console.log(req.body);
  return res.send("Login success");
});

app.listen(PORT, () => {
  console.log(clc.yellowBright.underline(`http://localhost:${PORT}`));
});

//TODO
//C(EJS),S(Nodejs),DB(mongoDb)

//Mongodb Connection : Done

//Set EJS to express view engine : Done

//Register Page
//Register API

//login Page
//login API

//Session Base Auth

//Dashboard Page (TODO Page)
//logout
//logout from all the devices

//TODO API
//create
//read
//edit
//delete

//Dashboard
//AXIOS
//CRUD with GET and Post
//Read component

//Pagination API
//Rate limiting
