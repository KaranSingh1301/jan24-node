const express = require("express");
const { validateRegisterData } = require("../Utils/AuthUtils");
const UserSchema = require("../Schemas/UserSchema");
const AuthRouter = express.Router();

AuthRouter.post("/register", async (req, res) => {
  console.log(req.body);
  const { name, email, password, username } = req.body;

  //clean the data
  try {
    await validateRegisterData({ name, email, password, username });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data invalid",
      error: error,
    });
  }

  const userObj = new UserSchema({
    name: name,
    email: email,
    password: password,
    username: username,
  });

  try {
    const userDb = await userObj.save();
    console.log(userDb);

    return res.send({
      status: 200,
      message: "Register success",
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

AuthRouter.post("/login", (req, res) => {
  console.log("login working");
  return res.send("login hit");
});

module.exports = AuthRouter;

//server<--->Router<--->Controller<---->Model<--->Schema
