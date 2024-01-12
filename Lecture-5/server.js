const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./userModel");
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//constants
const app = express();
const MONGO_URI =
  "mongodb+srv://karan:12345@cluster0.22wn2.mongodb.net/jan24TestDb";

const store = new mongoDbSession({
  uri: MONGO_URI,
  collection: "sessions",
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "This is jan24 nodejs class",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

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

app.get("/register", (req, res) => {
  return res.send(
    `
          <html>
          <body>
          <h1>Register form<h1/>
          <form action = "/register" method="POST">
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

app.post("/register", async (req, res) => {
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
    // userModel.create()
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

app.get("/login", (req, res) => {
  return res.send(`
  <html>
  <body>
  <h1>Login Form<h1/>
  <form action = "/login" method="POST">
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
  `);
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  //find the user from db
  try {
    const userDb = await userModel.findOne({ email: email });
    console.log("here", userDb);

    if (!userDb) {
      return res.send("User not found, please register first");
    }

    if (password !== userDb.password) {
      return res.send("Password does not matched");
    }

    console.log(req.session);
    req.session.isAuth = true;
    console.log(req.session);
    return res.send({
      status: 200,
      message: "Login Successfull",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

app.get("/dashboard", (req, res) => {
  console.log(req.session);
  if (req.session.isAuth) return res.send("Dashboard Page");
  else return res.send("Session expired, please login again");
});

app.listen(8000, () => {
  console.log("Server is running on PORT:8000");
});
