import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";

const handler = async (req, res) => {
  try {
    await connectDB();

    const nfts = await NFTModel.find({ "auction.endTime": { $gt: 0 } });

    return res.status(200).json({
      status: "success",
      results: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      message: "something went wrong in the server",
    });
  }
};

export default handler;
