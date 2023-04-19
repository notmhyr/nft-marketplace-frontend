const mongoose = require("mongoose");

const listedNFTsSchema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: [true, "owner of the nft is required"],
    },
    nftAddress: {
      type: String,
      required: [true, " the nft contract address is required"],
    },
    collectionName: {
      type: String,
      required: [true, " collection name is required"],
    },
    tokenId: {
      type: Number,
      required: [true, "token id is required"],
    },
    tokenURI: {
      type: String,
      required: [true, "token URI is required"],
    },
    price: {
      type: Number,
      required: [true, "price is required"],
    },

    offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offer" }],
    auction: {
      minBid: Number,
      startTime: Number,
      endTime: Number,
      currentBid: Number,
    },
  },
  {
    timestamps: true,
  }
);

const listedNFT =
  mongoose.models.listedNFT || mongoose.model("listedNFT", listedNFTsSchema);

module.exports = listedNFT;
