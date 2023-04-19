import connectDB from "../../../utils/connectDB";
import NFTModel from "../../../models/listingModel";

export default async function handler(req, res) {
  const { id, owner, nftAddress, tokenId, newPrice } = req.body;

  // returns if all values not sended
  if (!owner || !nftAddress || !tokenId || !newPrice) {
    return res.status(400).json({
      status: "error",
      message: "missing value",
    });
  }

  try {
    await connectDB();

    // update the document in db
    const updateListing = await NFTModel.findOneAndUpdate(
      { owner, nftAddress, tokenId },
      { price: newPrice },
      {
        new: true,
      }
    );

    // sending the success response to client
    res.status(201).json({
      status: "success",
      data: {
        nft: updateListing,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      status: "error",
      message: "something went wrong in the server",
    });
  }
}
