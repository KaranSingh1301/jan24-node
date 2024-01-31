const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validateRegisterData = ({ name, email, password, username }) => {
  return new Promise((resolve, reject) => {
    if (!name || !email || !username || !password)
      reject("Missing credentials");

    if (typeof email !== "string") reject("Email is not string");
    if (typeof username !== "string") reject("username is not string");
    if (typeof password !== "string") reject("password is not string");

    if (username.length < 3 || username.length > 50)
      reject("Length of username should be 3-50");

    if (!validateEmail(email)) reject("Email format is wrong");

    resolve();
  });
};

module.exports = { validateRegisterData, validateEmail };
