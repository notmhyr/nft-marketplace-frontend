import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";
const handler = async (req, res) => {
  const { nftAddress, tokenId, bid } = req.body;
  if (!nftAddress || !tokenId || !bid) {
    return res.status(400).json({
      status: "error",
      message: "missing value",
    });
  }

  try {
    await connectDB();
    const nft = await NFTModel.findOne({ nftAddress, tokenId });

    if (nft.auction.minBid > 0) {
      nft.auction.currentBid = bid;

      nft.save();
      res.status(201).json({
        status: "success",
        data: {
          nft,
        },
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "nft doesn't have any auctions",
      });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      message: "something went wrong in the server",
    });
  }
};

export default handler;
