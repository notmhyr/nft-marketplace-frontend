import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";

export default async function handler(req, res) {
  const { owner, nftAddress, tokenId } = req.body;

  // returns if all values not sended
  if (!owner || !nftAddress || !tokenId) {
    return res.status(400).json({
      status: "error",
      message: "missing value",
    });
  }

  try {
    await connectDB();
    await NFTModel.findOneAndDelete({ owner, nftAddress, tokenId });

    // sending the success response to client
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      message: "something went wrong in the server",
    });
  }
}
