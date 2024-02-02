const FollowSchema = require("../Schemas/FollowSchema");
const UserSchema = require("../Schemas/UserSchema");
const { LIMIT } = require("../privateConstants");

const followUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if A already follow B
      const followExist = await FollowSchema.findOne({
        followerUserId,
        followingUserId,
      });

      if (followExist) {
        return reject("Already following the user");
      }

      const followObj = new FollowSchema({
        followerUserId: followerUserId,
        followingUserId: followingUserId,
        creationDateTime: Date.now(),
      });

      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

const followerUserList = ({ followingUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followerList = await FollowSchema.aggregate([
        {
          $match: { followingUserId: followingUserId },
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

      //populate the data
      //   const followerList = await FollowSchema.find({
      //     followingUserId,
      //   })
      //     .populate("followerUserId")
      //     .sort();

      const followersUserIdsList = [];
      followerList[0].data.map(async (followObj) => {
        followersUserIdsList.push(followObj.followerUserId);
      });

      const followerUserDetails = await UserSchema.aggregate([
        {
          $match: { _id: { $in: followersUserIdsList } },
        },
      ]);

      resolve(followerUserDetails.reverse());
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const followingUserList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followingList = await FollowSchema.aggregate([
        {
          $match: { followerUserId: followerUserId },
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

      const followingUserIdsList = [];
      followingList[0].data.map((obj) => {
        followingUserIdsList.push(obj.followingUserId);
      });

      const followingUserDetails = await UserSchema.aggregate([
        { $match: { _id: { $in: followingUserIdsList } } },
      ]);

      resolve(followingUserDetails.reverse());
    } catch (error) {
      reject(error);
    }
  });
};

const unFollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await FollowSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  followUser,
  followerUserList,
  followingUserList,
  unFollowUser,
};
