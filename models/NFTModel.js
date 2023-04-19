const mongoose = require("mongoose");

const NFTModel = new mongoose.Schema(
  {
    collectionAddress: {
      type: String,
      required: true,
    },
    collectionName: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    tokenId: {
      type: Number,
      required: true,
    },
    tokenURI: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const nft = mongoose.models.nft || mongoose.model("nft", NFTModel);

module.exports = nft;
