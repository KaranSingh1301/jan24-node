const express = require("express");

//file-imports
const User = require("../Models/UserModel");
const { blogDataValidate } = require("../Utils/BlogUtils");
const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  updateBlog,
  deleteBlog,
} = require("../Models/BlogModel");
const rateLimiting = require("../Middlewares/RateLimitingMiddleware");

const BlogRouter = express.Router();

BlogRouter.post("/create-blog", rateLimiting, async (req, res) => {
  const userId = req.session.user.userId;
  const { title, textBody } = req.body;
  const creationDateTime = new Date();
  //data validation
  try {
    await blogDataValidate({ title, textBody });
    const user = await User.findUserWithId({ userId });
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

// {data: {
//   title,
//   textBody
// },
// blogId}

BlogRouter.post("/edit-blog", rateLimiting, async (req, res) => {
  const { title, textBody } = req.body.data;
  const userId = req.session.user.userId;
  const blogId = req.body.blogId;

  //data validation
  //verify userId
  try {
    await blogDataValidate({ title, textBody });
    await User.findUserWithId({ userId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data error",
      error: error,
    });
  }

  try {
    //find the blog with blogId
    const blogDb = await getBlogWithId({ blogId });

    //check owernership

    // if(userId.toString(), blogDb.userId.toString())
    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 401,
        message: "Not allow to edit, authorisation failed",
      });
    }

    // ||------------------>t1
    // ||------------------------------>t2
    //t2-t1

    //check time < 30 mins

    const diff =
      (Date.now() - new Date(blogDb.creationDateTime).getTime()) / (1000 * 60);
    console.log(diff);

    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not allow to edit after 30 mins of creation",
      });
    }

    //update the title and textBody
    const blogPrev = await updateBlog({ blogId, title, textBody });

    return res.send({
      status: 200,
      message: "Blog edited successfully",
      data: blogPrev,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

BlogRouter.post("/delete-blog", rateLimiting, async (req, res) => {
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    const blogDb = await getBlogWithId({ blogId });

    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 401,
        message: "Not allow to delete, authorisation failed.",
      });
    }

    const blogPrev = await deleteBlog({ blogId });

    return res.send({
      status: 200,
      message: "Delete successfull",
      data: blogPrev,
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
