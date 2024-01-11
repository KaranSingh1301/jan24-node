const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Cal app is running");
});

//addition
app.post("/add", (req, res) => {
  console.log(req.body);
  const { num1, num2 } = req.body;

  //data validation
  if (!num1 || !num2) {
    return res.send(`Data is missing: num1 = ${num1}, num2 = ${num2}`);
  }

  console.log(typeof num1);
  if (typeof num1 !== "number" || typeof num2 !== "number") {
    return res.send("Data types of numbers are incorrect");
  }

  const result = num1 + num2;
  //   return res.status(200);
  return res.send({
    status: 200,
    message: "Addition is successfull",
    result: result,
  });
});

//sub, GET num1 & num2 in queries
// /sub?num1=100&num2=200

app.get("/sub", (req, res) => {
  const { num1, num2 } = req.query;

  if (!num1 || !num2) {
    return res.send(`Data is missing: num1 = ${num1}, num2 = ${num2}`);
  }

  const result = Math.abs(parseInt(num1) - Number(num2));

  console.log(req.query);
  return res.send({
    status: 200,
    message: "Subtraction is successfull",
    result: result,
  });
});

//mul, div
//app.get('/mul/:id1/:id2')

app.get("/div/:num/:den", (req, res) => {
  console.log(req.params);
  const { num, den } = req.params;

  if (!num || !den) {
    return res.send(`Data is missing: num1 = ${num}, num2 = ${den}`);
  }

  if (den === "0") return res.send("Denominator can not be zero");

  const result = parseInt(num) / parseInt(den);

  return res.send({
    status: 200,
    message: "Div success",
    result: result,
  });
});

app.listen(8001, () => {
  console.log("Cal app is running on port:8001");
});
