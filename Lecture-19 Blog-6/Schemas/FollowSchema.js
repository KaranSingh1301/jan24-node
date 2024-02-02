const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followSchema = new Schema({
  followerUserId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  followingUserId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  creationDateTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("follow", followSchema);
