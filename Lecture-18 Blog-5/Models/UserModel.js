const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;

let User = class {
  username;
  name;
  email;
  password;

  constructor({ email, username, password, name }) {
    this.email = email;
    this.username = username;
    this.name = name;
    this.password = password;
  }

  register() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        Number(process.env.SALT)
      );

      const userObj = new UserSchema({
        name: this.name,
        email: this.email,
        password: hashedPassword,
        username: this.username,
      });

      try {
        const userDb = await userObj.save();
        console.log(userDb);
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static userNameAndEmailExist({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await UserSchema.findOne({
          $or: [{ email }, { username }],
        });

        if (userExist && userExist.email === email) {
          reject("Email Already exist");
        }

        if (userExist && userExist.username === username) {
          reject("Username Already exist");
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithLoginId({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });

        if (!userDb) reject("User does not found, please register first");

        resolve(userDb);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static findUserWithId({ userId }) {
    return new Promise(async (resolve, reject) => {
      if (!ObjectId.isValid(userId)) reject("Invalid userId format");

      try {
        const userDb = await UserSchema.findOne({ _id: userId });
        if (!userDb) reject(`No user found with Id : ${userId}`);
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = User;
