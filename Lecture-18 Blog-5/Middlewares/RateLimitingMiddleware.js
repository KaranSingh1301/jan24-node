const AccessSchema = require("../Schemas/AccessSchema");

const rateLimiting = async (req, res, next) => {
  const sessionId = req.session.id;

  try {
    const accessDb = await AccessSchema.findOne({ sessionId: sessionId });

    if (!accessDb) {
      //first request
      const accessObj = new AccessSchema({
        sessionId: sessionId,
        time: Date.now(),
      });
      await accessObj.save();
      next();
      return;
    }

    const diff = (Date.now() - accessDb.time) / 1000;
    // 1 hit / sec
    if (diff < 1) {
      return res.send({
        status: 400,
        message: "Too many request, please wait for some time",
      });
    }

    //update the time with current request time
    await AccessSchema.findOneAndUpdate({ sessionId }, { time: Date.now() });
    next();
  } catch (error) {
    return res.send({
      status: 500,
      error: error,
    });
  }
};

module.exports = rateLimiting;
