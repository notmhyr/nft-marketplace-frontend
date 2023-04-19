const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  offerer: { type: String, required: true },
  amount: { type: Number, required: true },
  expireAt: {
    type: Date,
    expires: 0,
  },
});

const offer = mongoose.models.offer || mongoose.model("offer", offerSchema);

module.exports = offer;
