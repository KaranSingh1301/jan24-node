const express = require("express");

//file-imports
const User = require("../Models/UserModel");
const { blogDataValidate } = require("../Utils/BlogUtils");
const { createBlog, getAllBlogs, getMyBlogs } = require("../Models/BlogModel");

const BlogRouter = express.Router();

BlogRouter.post("/create-blog", async (req, res) => {
  const userId = req.session.user.userId;
  const { title, textBody } = req.body;
  const creationDateTime = new Date();
  console.log(userId);
  //data validation
  try {
    await blogDataValidate({ title, textBody });
    const user = await User.findUserWithId({ userId });
    console.log("user", user);
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data error",
      error: error,
    });
  }

  //create blog in DB
  try {
    const blogDb = await createBlog({
      title,
      textBody,
      userId,
      creationDateTime,
    });
    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

//   /get-blogs?skip=6
BlogRouter.get("/get-blogs", async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;

  try {
    const blogDb = await getAllBlogs({ SKIP });

    if (blogDb.length === 0) {
      return res.send({
        status: 200,
        message: "No Blogs found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// /my-blogs?skip=2
BlogRouter.get("/my-blogs", async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const userId = req.session.user.userId;

  try {
    const myBlogsDb = await getMyBlogs({ SKIP, userId });
    if (myBlogsDb.length === 0) {
      return res.send({
        status: 200,
        message: "No Blogs found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: myBlogsDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = BlogRouter;
