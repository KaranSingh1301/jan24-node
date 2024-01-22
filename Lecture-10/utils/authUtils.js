const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const cleanupAndValidate = ({ name, email, username, password }) => {
  return new Promise((resolve, reject) => {
    if (!name || !email || !username || !password)
      reject("Missing credentials");

    if (typeof name !== "string") reject("Datatype of name is wrong");
    if (typeof email !== "string") reject("Datatype of email is wrong");
    if (typeof username !== "string") reject("Datatype of username is wrong");
    if (typeof password !== "string") reject("Datatype of password is wrong");

    if (username.length <= 2 || username.length > 30)
      reject("username length should be 3-30");

    if (password.length <= 2 || password.length > 30)
      reject("password length should be 3-30");

    if (!validator.isEmail(email)) {
      //foo@bar.com, return true || false
      reject("Email format is wrong");
    }
    // if(validator.isEmail(username))

    //validator.isAplha(password)
    resolve();
  });
};

const genrateJWTToken = (email) => {
  const token = jwt.sign(email, process.env.SECRET_KEY);
  return token;
};

const sendVerificationEmail = ({ email, verifyToken }) => {
  const transpoter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: "kssinghkaran13@gmail.com",
      pass: "hvhx dlsl fqjg wpes",
    },
  });

  const mailOptions = {
    from: "kssinghkaran13@gmail.com",
    to: email,
    subject: "Email verification for TODO APP",
    html: `Click <a href="http://localhost:8000/verifytoken/${verifyToken}">Here</a>`,
  };

  transpoter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else
      console.log(
        `Email has been sent Successfully :${email} ` + info.response
      );
  });
};

module.exports = { cleanupAndValidate, genrateJWTToken, sendVerificationEmail };
