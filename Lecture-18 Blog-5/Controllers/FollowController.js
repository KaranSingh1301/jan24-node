const express = require("express");
const FollowRouter = express.Router();
const User = require("../Models/UserModel");
const {
  followUser,
  followerUserList,
  followingUserList,
} = require("../Models/FollowModel");

FollowRouter.post("/follow-user", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;

  try {
    await User.findUserWithId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Follower user not found",
      error: error,
    });
  }

  try {
    await User.findUserWithId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Following user not found",
      error: error,
    });
  }

  try {
    const followDb = await followUser({ followerUserId, followingUserId });

    return res.send({
      status: 201,
      message: "Follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

// //followers-list?skip=10
FollowRouter.get("/followers-list", async (req, res) => {
  const followingUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    await User.findUserWithId({ userId: followingUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Following user not found",
      error: error,
    });
  }

  try {
    const data = await followerUserList({ followingUserId, SKIP });

    return res.send({
      status: 200,
      message: "Read success",
      data: data,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

FollowRouter.get("/following-list", async (req, res) => {
  const followerUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  try {
    await User.findUserWithId({ userId: followerUserId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Following user not found",
      error: error,
    });
  }

  try {
    const data = await followingUserList({ followerUserId, SKIP });

    return res.send({
      status: 200,
      message: "Read success",
      data: data,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Database error",
      error: error,
    });
  }
});

module.exports = FollowRouter;

//test
//test1--->test
//test2--->test
//test3--->test
//test2--->test3
