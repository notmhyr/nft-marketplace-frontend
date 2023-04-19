const mongoose = require("mongoose");

const collectionsSchema = new mongoose.Schema(
  {
    collectionAddress: {
      type: String,
      required: true,
    },
    collectionName: {
      type: String,
      required: true,
    },
    listedNFTs: [{ type: mongoose.Schema.Types.ObjectId, ref: "listedNFT" }],
  },
  {
    timestamps: true,
  }
);

const collection =
  mongoose.models.collection || mongoose.model("collection", collectionsSchema);

module.exports = collection;
