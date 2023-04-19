import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";
const handler = async (req, res) => {
  const { nftAddress, tokenId, auction } = req.body;
  if (!nftAddress || !tokenId || !auction) {
    return res.status(400).json({
      status: "error",
      message: "missing value",
    });
  }

  try {
    await connectDB();
    const nft = await NFTModel.findOneAndUpdate(
      { nftAddress, tokenId },
      { auction }
    );

    res.status(201).json({
      status: "success",
      data: {
        nft,
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
