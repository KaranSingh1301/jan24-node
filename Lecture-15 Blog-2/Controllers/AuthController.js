const express = require("express");
const { validateRegisterData } = require("../Utils/AuthUtils");
const UserSchema = require("../Schemas/UserSchema");
const User = require("../Models/UserModel");
const AuthRouter = express.Router();
const bcrypt = require("bcrypt");
const isAuth = require("../Middlewares/AuthMiddleware");

const ObjectId = require("mongodb").ObjectId;

AuthRouter.post("/register", async (req, res) => {
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

  try {
    await User.usernameAndEmailExist({ email, username });

    const userObj = new User({ name, email, username, password });
    const userDb = await userObj.register();

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

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing credentials",
    });

  try {
    //find the user with loginId
    const userDb = await User.findUserWithLoginId({ loginId });

    //compare the password

    const isMatched = await bcrypt.compare(password, userDb.password);

    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Password does not matched",
      });
    }

    //session base auth
    req.session.isAuth = true;
    req.session.user = {
      email: userDb.email,
      username: userDb.username,
      userId: userDb._id, //either convert it into string
    };

    return res.send({
      status: 200,
      message: "Login Success",
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

AuthRouter.post("/logout", isAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.send({
        status: 400,
        message: "Logout not successfull",
      });

    return res.send({
      status: 200,
      message: "Logout successfull",
    });
  });
});

module.exports = AuthRouter;

//server<--->Router<--->Controller<---->Model<--->Schema
