const BlogSchema = require("../Schemas/BlogSchema");
const { LIMIT } = require("../privateConstants");
const ObjectId = require("mongodb").ObjectId;

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
const getAllBlogs = ({ followingUserIds, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await BlogSchema.aggregate([
        {
          $match: {
            userId: { $in: followingUserIds },
            isDeleted: { $ne: true },
          },
        },
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
          $match: { userId: userId, isDeleted: { $ne: true } },
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

const getBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!ObjectId.isValid(blogId)) reject("Invalid blogId format");
      const blogDb = await BlogSchema.findOne({ _id: blogId });
      if (!blogDb) reject(`No blog found with this ID: ${blogId}`);

      resolve(blogDb);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const updateBlog = ({ blogId, title, textBody }) => {
  return new Promise(async (resolve, reject) => {
    let newBlogData = {};

    newBlogData.title = title;
    newBlogData.textBody = textBody;
    try {
      const blogPrev = await BlogSchema.findOneAndUpdate(
        { _id: blogId },
        newBlogData
      );
      resolve(blogPrev);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteBlog = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // const blogPrev = await BlogSchema.findOneAndDelete({ _id: blogId });
      const deletedBlog = await BlogSchema.findOneAndUpdate(
        { _id: blogId },
        { isDeleted: true, deletionDateTime: new Date() }
      );

      resolve(deletedBlog);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  updateBlog,
  deleteBlog,
};
