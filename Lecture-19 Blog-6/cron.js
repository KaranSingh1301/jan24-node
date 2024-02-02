const cron = require("node-cron");
const BlogSchema = require("./Schemas/BlogSchema");
const clc = require("cli-color");

function cleanUpBin() {
  cron.schedule("* 1 * * *", async () => {
    console.log("cron is working");

    const deletedBlogs = await BlogSchema.find({ isDeleted: true });
    if (deletedBlogs.length > 0) {
      deletedBlogs.map(async (blog) => {
        console.log(
          (Date.now() - new Date(blog.deletionDateTime).getTime()) / (1000 * 60)
        );
        const diff =
          (Date.now() - new Date(blog.deletionDateTime).getTime()) /
          (1000 * 60 * 60 * 24);
        if (diff > 30) {
          await BlogSchema.findOneAndDelete({ _id: blog._id })
            .then(() => {
              console.log(
                clc.greenBright(`blog deleted successfully: ${blog._id}`)
              );
            })
            .catch((err) => {
              console.log(clc.redBright(err));
            });
        }
      });
    }
  });
}

module.exports = cleanUpBin;
