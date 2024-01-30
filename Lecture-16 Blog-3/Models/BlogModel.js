const BlogSchema = require("../Schemas/BlogSchema");
const { LIMIT } = require("../privateConstants");

const createBlog = ({ title, textBody, userId, creationDateTime }) => {
  return new Promise(async (resolve, reject) => {
    title.trim();
    textBody.trim();

    const blogObj = new BlogSchema({
      title: title,
      textBody: textBody,
      userId: userId,
      creationDateTime: creationDateTime,
    });

    try {
      const blogdb = await blogObj.save();
      resolve(blogdb);
    } catch (error) {
      reject(error);
    }
  });
};

//sort
//pagination
const getAllBlogs = ({ SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await BlogSchema.aggregate([
        {
          $sort: { creationDateTime: -1 }, //DESC
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      resolve(blogDb[0].data);
    } catch (error) {
      reject(error);
    }
  });
};

const getMyBlogs = ({ SKIP, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const myBlogsDb = await BlogSchema.aggregate([
        {
          $match: { userId: userId },
        },
        {
          $sort: { creationDateTime: -1 },
        },
        {
          $facet: {
            data: [{ $skip: SKIP }, { $limit: LIMIT }],
          },
        },
      ]);
      resolve(myBlogsDb[0].data);
    } catch (error) {
      reject(error);
    }

    resolve();
  });
};

module.exports = { createBlog, getAllBlogs, getMyBlogs };
