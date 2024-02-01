const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  textBody: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 500,
  },
  creationDateTime: {
    type: Date,
    required: true,
  },
  userId: {
    //fk to userschema
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});

module.exports = mongoose.model("blog", blogSchema);
