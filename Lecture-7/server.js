const express = require("express");
require("dotenv").config();
const clc = require("cli-color");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file-imports
const { cleanupAndValidate } = require("./utils/authUtils");
const userModel = require("./models/userModel");
const isAuth = require("./middleware/isAuth");

//constants
const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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

  //hashing the password

  const hashedPassword = await bcrypt.hash(
    password,
    parseInt(process.env.SALT)
  );
  console.log(password, hashedPassword);

  //store data in DB
  const userObj = new userModel({
    //schema key : value
    name: name,
    email: email,
    username: username,
    password: hashedPassword,
  });

  try {
    const userDb = await userObj.save();

    return res.redirect("/login");
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

app.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  //find the user with loginId

  try {
    let userDb;
    if (validator.isEmail(loginId)) {
      userDb = await userModel.findOne({ email: loginId });
      if (!userDb) {
        return res.send({
          status: 400,
          message: "Email not found",
        });
      }
    } else {
      userDb = await userModel.findOne({ username: loginId });
      if (!userDb) {
        return res.send({
          status: 400,
          message: "Username not found",
        });
      }
    }

    //compare the password
    const isMatched = await bcrypt.compare(password, userDb.password);

    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Password incorrect",
      });
    }

    //session base auth
    console.log(req.session);
    req.session.isAuth = true;
    req.session.user = {
      email: userDb.email,
      username: userDb.username,
      userId: userDb._id,
    };

    return res.redirect("/dashboard");
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  return res.render("dashboard");
});

app.post("/logout", isAuth, (req, res) => {
  console.log(req.session.id);
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.send({
        status: 500,
        message: "Logout unsucessfull",
        error: err,
      });
    }

    return res.redirect("/login");
  });
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
//create a middleware for authentication

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

//todo 1,2,3
//mongodb 1,2

//mongodb schema, modelQueries, operators, aggregate fun, creating relation and populate

//BACK?????
