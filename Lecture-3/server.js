//ES5
const express = require("express");

const app = express();
const PORT = 8000;

//middleware
app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

//api
app.get("/", (req, res) => {
  console.log("GET / working");
  return res.send("Server app is running");
});

app.get("/get-form", (req, res) => {
  return res.send(`
    <html>
    <body>
        <h1>User Form</h1>
        <form action='/api/form_submit' method="POST">
            <label for="name">Name</label>
            <input type='text' name="name"></input>
            <br/>
            <label for="email">Email</label>
            <input type='text' name="email"></input>
            <br/>
            <label for="password">Password</label>
            <input type='text' name="password"></input>

            <button type='submit'>Submit</button>
        <form/>
    <body/>
    <html/>
  `);
});

app.post("/api/form_submit", (req, res) => {
  console.log(req.body);
  return res.send("Form submitted successfully");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
